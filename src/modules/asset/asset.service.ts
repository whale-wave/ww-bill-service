import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindConditions, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { mathHelper } from '../../utils';
import { AssetEntity, AssetGroupAssetType, AssetGroupEntity, AssetGroupType, AssetRecordEntity, AssetStatisticalRecord, AssetStatisticalRecordType } from '../../entity';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { AdjustAssetDto, CreateAssetDto } from './dto';

@Injectable()
export class AssetService {
  readonly logger = new Logger(AssetService.name);

  constructor(
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    @InjectRepository(AssetGroupEntity)
    private assetGroupRepository: Repository<AssetGroupEntity>,
    @InjectRepository(AssetRecordEntity)
    private assetRecordRepository: Repository<AssetRecordEntity>,
    @InjectRepository(AssetStatisticalRecord)
    private assetStatisticalRecordRepository: Repository<AssetStatisticalRecord>,
    private userService: UserService,
  ) {}

  async getAssetStatisticalRecordList(userId: number, findConditions: FindConditions<AssetStatisticalRecord>) {
    return await this.assetStatisticalRecordRepository.find({
      where: {
        user: { id: userId },
        ...findConditions,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async getAssetGroup(userId: number, assetGroupId: string) {
    const systemUserInfo = await this.userService.getSystemUserInfo();
    return this.assetGroupRepository.findOne({
      where: [
        { id: assetGroupId, user: { id: userId } },
        { id: assetGroupId, user: { id: systemUserInfo.id } },
      ],
    });
  }

  async getAssetGroupList() {
    const systemUserInfo = await this.userService.getSystemUserInfo();
    const assetGroups = await this.assetGroupRepository.find({
      where: [{ user: { id: systemUserInfo.id } }],
      order: { order: 'ASC' },
    });
    return assetGroups;
  }

  async createAsset(userId: number, createAssetDto: CreateAssetDto) {
    const assetGroup = await this.assetGroupRepository.findOne({ where: { id: createAssetDto.groupId } });

    const assetEntity = new AssetEntity();
    assetEntity.name = createAssetDto.name;
    assetEntity.comment = createAssetDto.comment;
    assetEntity.amount = createAssetDto.amount;
    assetEntity.assetGroup = { id: createAssetDto.groupId } as AssetGroupEntity;
    assetEntity.cardId = createAssetDto.cardId;
    assetEntity.user = { id: userId } as User;
    const asset = await this.assetRepository.save(assetEntity);

    const assetRecordEntity = new AssetRecordEntity();
    assetRecordEntity.name = `手动调整${assetGroup.type === AssetGroupType.ADD ? '余额' : '欠款'}`;
    assetRecordEntity.type = 'add';
    assetRecordEntity.amount = createAssetDto.amount;
    assetRecordEntity.beforeAmount = '0';
    assetRecordEntity.afterAmount = createAssetDto.amount;
    assetRecordEntity.comment = `从 ${assetRecordEntity.beforeAmount} 调整为 ${assetRecordEntity.afterAmount}`;
    assetRecordEntity.asset = asset;
    assetRecordEntity.user = { id: userId } as User;
    await this.assetRecordRepository.save(assetRecordEntity);

    await this.updateAssetStatisticalRecord({ userId });
  }

  async findOneAssetRecord(userId: number, assetRecordId: string) {
    return await this.assetRecordRepository.findOne({
      where: {
        user: { id: userId },
        id: assetRecordId,
      },
      relations: ['asset', 'asset.assetGroup'],
    });
  }

  async findAssetRecordList(userId: number, findConditions: FindConditions<AssetRecordEntity>) {
    return await this.assetRecordRepository.find({
      where: { user: { id: userId }, ...findConditions },
      order: { createdAt: 'DESC' },
      relations: ['asset', 'asset.assetGroup'],
    });
  }

  async findAssetList(userId: number) {
    return this.assetRepository.find({ where: { user: { id: userId } }, relations: ['assetGroup'] });
  }

  async findOneAsset(userId: number, assetId: string) {
    return this.assetRepository.findOne({ where: { user: { id: userId }, id: assetId }, relations: ['assetGroup'] });
  }

  async deleteAsset(userId: number, assetId: string) {
    await this.assetRecordRepository.delete({ asset: { id: assetId, user: { id: userId } } });
    await this.assetRepository.delete({ user: { id: userId }, id: assetId });
    await this.updateAssetStatisticalRecord({ userId });
  }

  async adjustAsset(userId: number, assetId: string, adjustAssetDto: AdjustAssetDto) {
    const asset = await this.assetRepository.findOne({ where: { user: { id: userId }, id: assetId }, relations: ['assetGroup'] });

    const operationAmount = mathHelper.subtract(adjustAssetDto.amount || asset.amount, asset.amount).toNumber();
    if (operationAmount !== 0) {
      const assetRecord = new AssetRecordEntity();
      assetRecord.name = `手动调整${asset.assetGroup.type === AssetGroupType.ADD ? '余额' : '欠款'}`;
      assetRecord.type = operationAmount > 0 ? 'add' : 'sub';
      assetRecord.amount = Math.abs(operationAmount).toString();
      assetRecord.beforeAmount = asset.amount;
      assetRecord.afterAmount = adjustAssetDto.amount;
      assetRecord.comment = `从 ${assetRecord.beforeAmount} 调整为 ${assetRecord.afterAmount}`;
      assetRecord.user = { id: userId } as User;
      assetRecord.asset = asset;

      await this.assetRecordRepository.save(assetRecord);
    }

    await this.assetRepository.update(assetId, adjustAssetDto);
    await this.updateAssetStatisticalRecord({ userId });
  }

  async createDefaultAssetGroup(superAdminId: number) {
    const defaultAssetGroup = [
      {
        id: '63da2689-9c6b-4a7f-a3fc-cf0395d80e36',
        name: '现金',
        icon: 'cash',
        type: AssetGroupType.ADD,
        fixedName: true,
        order: 1,
      },
      {
        id: '6f20e4bd-baf8-4fbc-9647-3fd79b95daf6',
        name: '储蓄卡',
        icon: 'bank',
        type: AssetGroupType.ADD,
        fixedName: true,
        order: 2,
        children: [
          // Start of Selection
          {
            id: '8ed7527d-0e5a-4222-8674-c235e4250c6a',
            name: '工商银行',
            icon: 'ICBC',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 101,
          },
          {
            id: 'def22bad-5c3c-43b6-9be4-cbf3bd74e90a',
            name: '建设银行',
            icon: 'CCB',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 102,
          },
          {
            id: '63067ee8-31e6-463b-b898-e596a47b90c2',
            name: '农业银行',
            icon: 'ABC',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 103,
          },
          {
            id: 'f947f148-ed9d-4bc4-9904-a88770123679',
            name: '中国银行',
            icon: 'BOC',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 104,
          },
          {
            id: '3575b078-e5b7-4816-99dd-11f99eab6cde',
            name: '招商银行',
            icon: 'CMB',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 105,
          },
          {
            id: '63c1f440-214f-411b-a4f3-3a328cd69b98',
            name: '交通银行',
            icon: 'BOCOM',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 106,
          },
          {
            id: '887a46db-7036-4139-b45e-4fd2260f136c',
            name: '中信银行',
            icon: 'CITIC',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 107,
          },
          {
            id: '8cb7cefa-92bd-412e-895d-57c74254c71b',
            name: '浦发银行',
            icon: 'SPDB',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 108,
          },
          {
            id: '6f132e67-8524-4231-9d6e-75865e43c191',
            name: '光大银行',
            icon: 'CEB',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 109,
          },
          {
            id: 'c7288b1c-145b-41ba-b774-743ee20703f9',
            name: '广发银行',
            icon: 'CGB',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: true,
            order: 110,
          },
          {
            id: '3aa3b95b-ca3a-441d-b95e-91a2ffd630ba',
            name: '其他银行',
            icon: 'bank',
            level: 1,
            type: AssetGroupType.ADD,
            assetType: AssetGroupAssetType.BANK,
            fixedName: false,
            order: 111,
          },
        ],
      },
      {
        id: '28bb0e47-4059-4bc7-a0c5-f326a38896d5',
        name: '信用卡',
        type: AssetGroupType.SUB,
        icon: 'credit-card',
        description: '信用卡/蚂蚁花呗/京东白条',
        order: 3,
        fixedName: true,
        children: [
          {
            id: 'a63fb1c3-af74-4a40-8a84-300ee8f7323d',
            name: '蚂蚁花呗',
            icon: 'ant',
            level: 1,
            type: AssetGroupType.SUB,
            order: 112,
            fixedName: true,
          },
          {
            id: 'e9b2d68a-9399-4818-af1b-ff01d112252d',
            name: '京东白条',
            icon: 'jd',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 113,
            fixedName: true,
          },
          {
            id: '60c769f5-9bdb-41d1-872a-dea79f648810',
            name: '苏宁任性付',
            icon: 'suning',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 114,
            fixedName: true,
          },
          {
            id: '1467ee0d-ee6b-40ca-bfa0-d889373bd6e0',
            name: '工商银行',
            icon: 'ICBC',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 115,
            fixedName: true,
          },
          {
            id: '527feca3-e062-404d-b362-88f98ea8d248',
            name: '建设银行',
            icon: 'CCB',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 116,
            fixedName: true,
          },
          {
            id: 'a345570b-e5f7-4c89-94cf-666df06e93f3',
            name: '农业银行',
            icon: 'ABC',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 117,
            fixedName: true,
          },
          {
            id: '5645dd67-fddf-4c9a-9178-3bd1c1843da9',
            name: '中国银行',
            icon: 'BOC',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 118,
            fixedName: true,
          },
          {
            id: '8857d6a9-2892-48bc-843e-69d29e4a044d',
            name: '招商银行',
            icon: 'CMB',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 119,
            fixedName: true,
          },
          {
            id: '8c8f95f8-e212-463a-955f-0f7e39d074b0',
            name: '交通银行',
            icon: 'BOCOM',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 120,
            fixedName: true,
          },
          {
            id: 'caf2777f-1423-4085-8cf9-f7133f156a66',
            name: '中信银行',
            icon: 'CITIC',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 121,
            fixedName: true,
          },
          {
            id: '97f44066-e4e2-42ff-8677-da8c964f9517',
            name: '浦发银行',
            icon: 'SPDB',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 122,
            fixedName: true,
          },
          {
            id: '44fdfb7c-b6f3-4f34-a662-641f76fd3cc0',
            name: '光大银行',
            icon: 'CEB',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 123,
            fixedName: true,
          },
          {
            id: '27f94f2d-27f1-4c05-8c37-6b7dc2f6680a',
            name: '广发银行',
            icon: 'CGB',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 124,
            fixedName: true,
          },
          {
            id: 'e41184e6-33e1-4676-959a-c639d18fccab',
            name: '其他银行',
            icon: 'bank',
            level: 1,
            type: AssetGroupType.SUB,
            assetType: AssetGroupAssetType.CREDIT,
            order: 125,
            fixedName: false,
          },
        ],
      },
      {
        id: '0c7246b4-3f2f-49ec-8b88-1edef40b38d2',
        name: '虚拟账号',
        icon: 'virtual-account',
        description: '支付宝/微信',
        type: AssetGroupType.ADD,
        order: 4,
        fixedName: true,
        children: [
          {
            id: 'e18c1db2-e90a-4ba2-a103-26b5ea1f1d3a',
            name: '支付宝',
            icon: 'alipay',
            level: 1,
            type: AssetGroupType.ADD,
            order: 126,
            fixedName: true,
          },
          {
            id: '7ead7c41-7895-4571-9172-96d049babe54',
            name: '微信',
            icon: 'wechat',
            level: 1,
            type: AssetGroupType.ADD,
            order: 127,
            fixedName: true,
          },
          {
            id: '2cda449d-34f5-4f0e-bcac-1168ff1676ba',
            name: '其他虚拟账号',
            icon: 'virtual-account',
            level: 1,
            type: AssetGroupType.ADD,
            order: 128,
            fixedName: false,
          },
        ],
      },
      {
        id: 'bdd0089d-4664-49aa-bd8d-1b7113af2fdd',
        name: '投资账户',
        icon: 'asset-account',
        description: '股票/基金/P2P',
        type: AssetGroupType.ADD,
        order: 5,
        fixedName: true,
        children: [
          {
            id: 'f1217e1e-a2fd-48cc-a18f-92aa6287e554',
            name: '股票',
            icon: 'stock',
            level: 1,
            type: AssetGroupType.ADD,
            order: 129,
            fixedName: true,
          },
          {
            id: '39b095bc-4733-4b80-96b7-0ea7f222898a',
            name: '基金',
            icon: 'fund',
            level: 1,
            type: AssetGroupType.ADD,
            order: 130,
            fixedName: true,
          },
          {
            id: 'bfee5d76-51da-4410-815e-f5e81cd51b92',
            name: '其他投资',
            icon: 'other-investment',
            level: 1,
            type: AssetGroupType.ADD,
            order: 131,
            fixedName: false,
          },
        ],
      },
      {
        id: '01586543-85fc-4b1b-b46f-a979caa529d0',
        name: '负债',
        icon: 'debt-liability',
        description: '贷款/借入',
        type: AssetGroupType.SUB,
        order: 6,
        fixedName: false,
      },
      {
        id: 'bfeab84c-0e10-4b32-aaa0-89ad7d17af68',
        name: '债权',
        icon: 'debt-receivable',
        description: '应收/借出',
        type: AssetGroupType.ADD,
        order: 7,
        fixedName: false,
      },
      {
        id: '939f3067-a0f0-4aab-b30a-e1f98e3dedb4',
        name: '自定义资产',
        icon: 'custom-asset',
        type: AssetGroupType.ADD,
        fixedName: false,
        order: 8,
      },
    ];

    for (const assetGroupItem of defaultAssetGroup) {
      const assetGroupEntity = new AssetGroupEntity();
      Object.assign(assetGroupEntity, assetGroupItem);
      assetGroupEntity.user = { id: superAdminId } as User;
      const assetGroup = await this.assetGroupRepository.save(assetGroupEntity);

      if (assetGroupItem.children) {
        for (const child of assetGroupItem.children) {
          const assetGroupChild = new AssetGroupEntity();
          Object.assign(assetGroupChild, child);
          assetGroupChild.user = { id: superAdminId } as User;
          assetGroupChild.parentId = assetGroup.id;
          await this.assetGroupRepository.save(assetGroupChild);
        }
      }
    }
  }

  async updateAssetStatisticalRecord(params: {
    userId: number;
  }) {
    const { userId } = params;

    const assetList = await this.assetRepository.find({
      where: {
        user: { id: userId } as User,
      },
      relations: ['assetGroup'],
    });

    const assetAmount = assetList.filter((asset: AssetEntity) => asset.assetGroup.type === AssetGroupType.ADD).reduce((acc, cur) => mathHelper.add(acc, cur.amount).toString(), '0');
    const liabilityAmount = assetList.filter((asset: AssetEntity) => asset.assetGroup.type === AssetGroupType.SUB).reduce((acc, cur) => mathHelper.add(acc, cur.amount).toString(), '0');
    const netAssetAmount = mathHelper.subtract(assetAmount, liabilityAmount).toString();

    const assetRecord = await this.assetStatisticalRecordRepository.findOne({
      where: {
        user: { id: userId } as User,
        type: AssetStatisticalRecordType.ASSET,
        createdAt: Between(dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()),
      },
    });

    if (assetRecord) {
      assetRecord.amount = assetAmount;
      await this.assetStatisticalRecordRepository.save(assetRecord);
    }
    else {
      const newAssetRecord = new AssetStatisticalRecord();
      newAssetRecord.amount = assetAmount;
      newAssetRecord.type = AssetStatisticalRecordType.ASSET;
      newAssetRecord.user = { id: userId } as User;
      await this.assetStatisticalRecordRepository.save(newAssetRecord);
    }

    const liabilityRecord = await this.assetStatisticalRecordRepository.findOne({
      where: {
        user: { id: userId } as User,
        type: AssetStatisticalRecordType.LIABILITY,
        createdAt: Between(dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()),
      },
    });

    if (liabilityRecord) {
      liabilityRecord.amount = liabilityAmount;
      await this.assetStatisticalRecordRepository.save(liabilityRecord);
    }
    else {
      const newLiabilityRecord = new AssetStatisticalRecord();
      newLiabilityRecord.amount = liabilityAmount;
      newLiabilityRecord.type = AssetStatisticalRecordType.LIABILITY;
      newLiabilityRecord.user = { id: userId } as User;
      await this.assetStatisticalRecordRepository.save(newLiabilityRecord);
    }

    const netAssetRecord = await this.assetStatisticalRecordRepository.findOne({
      where: {
        user: { id: userId } as User,
        type: AssetStatisticalRecordType.NET_ASSET,
        createdAt: Between(dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()),
      },
    });

    if (netAssetRecord) {
      netAssetRecord.amount = netAssetAmount;
      await this.assetStatisticalRecordRepository.save(netAssetRecord);
    }
    else {
      const newNetAssetRecord = new AssetStatisticalRecord();
      newNetAssetRecord.amount = netAssetAmount;
      newNetAssetRecord.type = AssetStatisticalRecordType.NET_ASSET;
      newNetAssetRecord.user = { id: userId } as User;
      await this.assetStatisticalRecordRepository.save(newNetAssetRecord);
    }
  }

  async updateAssetStatisticalRecordAllUser() {
    const users = await this.userService.findAll();
    for (const user of users) {
      await this.updateAssetStatisticalRecord({ userId: user.id });
      this.logger.debug(`更新用户 ${user.username} 的资产统计记录`);
    }
  }
}
