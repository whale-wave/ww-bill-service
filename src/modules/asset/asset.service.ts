import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetEntity, AssetGroupEntity, AssetRecordEntity } from 'src/entity';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    @InjectRepository(AssetGroupEntity)
    private assetGroupRepository: Repository<AssetGroupEntity>,
    @InjectRepository(AssetRecordEntity)
    private assetRecordRepository: Repository<AssetRecordEntity>,
    private userService: UserService,
  ) {}

  async getAssetGroupList() {
    const systemUserInfo = await this.userService.getSystemUserInfo();
    const assetGroups = await this.assetGroupRepository.find({
      where: [
        { user: { id: systemUserInfo.id } },
      ],
    });
    return assetGroups;
  }

  create(createAssetDto: CreateAssetDto) {
    return `This action adds a new asset, ${JSON.stringify(createAssetDto)}`;
  }

  findAll() {
    return `This action returns all asset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asset`;
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return `This action updates a #${id} asset, ${JSON.stringify(updateAssetDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} asset`;
  }

  async createDefaultAssetGroup(superAdminId: number) {
    const defaultAssetGroup = [
      {
        id: '63da2689-9c6b-4a7f-a3fc-cf0395d80e36',
        name: '现金',
        icon: 'cash',
      },
      {
        id: '6f20e4bd-baf8-4fbc-9647-3fd79b95daf6',
        name: '储蓄卡',
        icon: 'bank',
        children: [
          {
            id: '8ed7527d-0e5a-4222-8674-c235e4250c6a',
            name: '工商银行',
            icon: 'ICBC',
            level: 1,
          },
          {
            id: 'def22bad-5c3c-43b6-9be4-cbf3bd74e90a',
            name: '建设银行',
            icon: 'CCB',
            level: 1,
          },
          {
            id: '63067ee8-31e6-463b-b898-e596a47b90c2',
            name: '农业银行',
            icon: 'ABC',
            level: 1,
          },
          {
            id: 'f947f148-ed9d-4bc4-9904-a88770123679',
            name: '中国银行',
            icon: 'BOC',
            level: 1,
          },
          {
            id: '3575b078-e5b7-4816-99dd-11f99eab6cde',
            name: '招商银行',
            icon: 'CMB',
            level: 1,
          },
          {
            id: '63c1f440-214f-411b-a4f3-3a328cd69b98',
            name: '交通银行',
            icon: 'BOCOM',
            level: 1,
          },
          {
            id: '887a46db-7036-4139-b45e-4fd2260f136c',
            name: '中信银行',
            icon: 'CITIC',
            level: 1,
          },
          {
            id: '8cb7cefa-92bd-412e-895d-57c74254c71b',
            name: '浦发银行',
            icon: 'SPDB',
            level: 1,
          },
          {
            id: '6f132e67-8524-4231-9d6e-75865e43c191',
            name: '光大银行',
            icon: 'CEB',
            level: 1,
          },
          {
            id: 'c7288b1c-145b-41ba-b774-743ee20703f9',
            name: '广发银行',
            icon: 'CGB',
            level: 1,
          },
          {
            id: '3aa3b95b-ca3a-441d-b95e-91a2ffd630ba',
            name: '其他银行',
            icon: 'bank',
            level: 1,
          },
        ],
      },
      {
        id: '28bb0e47-4059-4bc7-a0c5-f326a38896d5',
        name: '信用卡',
        icon: 'credit-card',
        description: '信用卡/蚂蚁花呗/京东白条',
        children: [
          {
            id: 'a63fb1c3-af74-4a40-8a84-300ee8f7323d',
            name: '蚂蚁花呗',
            icon: 'ant',
            level: 1,
          },
          {
            id: 'e9b2d68a-9399-4818-af1b-ff01d112252d',
            name: '京东白条',
            icon: 'jd',
            level: 1,
          },
          {
            id: '60c769f5-9bdb-41d1-872a-dea79f648810',
            name: '苏宁任性付',
            icon: 'suning',
            level: 1,
          },
          {
            id: '1467ee0d-ee6b-40ca-bfa0-d889373bd6e0',
            name: '工商银行',
            icon: 'ICBC',
            level: 1,
          },
          {
            id: '527feca3-e062-404d-b362-88f98ea8d248',
            name: '建设银行',
            icon: 'CCB',
            level: 1,
          },
          {
            id: 'a345570b-e5f7-4c89-94cf-666df06e93f3',
            name: '农业银行',
            icon: 'ABC',
            level: 1,
          },
          {
            id: '5645dd67-fddf-4c9a-9178-3bd1c1843da9',
            name: '中国银行',
            icon: 'BOC',
            level: 1,
          },
          {
            id: '8857d6a9-2892-48bc-843e-69d29e4a044d',
            name: '招商银行',
            icon: 'CMB',
            level: 1,
          },
          {
            id: '8c8f95f8-e212-463a-955f-0f7e39d074b0',
            name: '交通银行',
            icon: 'BOCOM',
            level: 1,
          },
          {
            id: 'caf2777f-1423-4085-8cf9-f7133f156a66',
            name: '中信银行',
            icon: 'CITIC',
            level: 1,
          },
          {
            id: '97f44066-e4e2-42ff-8677-da8c964f9517',
            name: '浦发银行',
            icon: 'SPDB',
            level: 1,
          },
          {
            id: '44fdfb7c-b6f3-4f34-a662-641f76fd3cc0',
            name: '光大银行',
            icon: 'CEB',
            level: 1,
          },
          {
            id: '27f94f2d-27f1-4c05-8c37-6b7dc2f6680a',
            name: '广发银行',
            icon: 'CGB',
            level: 1,
          },
          {
            id: 'e41184e6-33e1-4676-959a-c639d18fccab',
            name: '其他银行',
            icon: 'bank',
            level: 1,
          },
        ],
      },
      {
        id: '0c7246b4-3f2f-49ec-8b88-1edef40b38d2',
        name: '虚拟账号',
        icon: 'virtual-account',
        description: '支付宝/微信',
        children: [
          {
            id: 'e18c1db2-e90a-4ba2-a103-26b5ea1f1d3a',
            name: '支付宝',
            icon: 'alipay',
            level: 1,
          },
          {
            id: '7ead7c41-7895-4571-9172-96d049babe54',
            name: '微信',
            icon: 'wechat',
            level: 1,
          },
          {
            id: '2cda449d-34f5-4f0e-bcac-1168ff1676ba',
            name: '其他虚拟账号',
            icon: 'virtual-account',
            level: 1,
          },
        ],
      },
      {
        id: 'bdd0089d-4664-49aa-bd8d-1b7113af2fdd',
        name: '资产账户',
        icon: 'asset-account',
        description: '股票/基金/P2P',
        children: [
          {
            id: 'f1217e1e-a2fd-48cc-a18f-92aa6287e554',
            name: '股票',
            icon: 'stock',
            level: 1,
          },
          {
            id: '39b095bc-4733-4b80-96b7-0ea7f222898a',
            name: '基金',
            icon: 'fund',
            level: 1,
          },
          {
            id: 'bfee5d76-51da-4410-815e-f5e81cd51b92',
            name: '其他投资',
            icon: 'other-investment',
            level: 1,
          },
        ],
      },
      {
        id: '01586543-85fc-4b1b-b46f-a979caa529d0',
        name: '负债',
        icon: 'debt-liability',
        description: '贷款/借入',
      },
      {
        id: 'bfeab84c-0e10-4b32-aaa0-89ad7d17af68',
        name: '债权',
        icon: 'debt-receivable',
        description: '应收/借出',
      },
      {
        id: '939f3067-a0f0-4aab-b30a-e1f98e3dedb4',
        name: '自定义资产',
        icon: 'custom-asset',
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
}
