import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetEntity, AssetGroupEntity, AssetRecordEntity } from 'src/entity';
import { User } from '../user/entity/user.entity';
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
  ) {}

  async getAssetGroupList() {
    return [];
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
        uuid: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        name: '现金',
        icon: 'cash',
      },
      {
        uuid: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        name: '储蓄卡',
        icon: 'bank',
        children: [
          {
            uuid: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
            name: '工商银行',
            icon: 'ICBC',
            level: 1,
          },
          {
            uuid: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
            name: '建设银行',
            icon: 'CCB',
            level: 1,
          },
          {
            uuid: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
            name: '农业银行',
            icon: 'ABC',
            level: 1,
          },
          {
            uuid: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
            name: '中国银行',
            icon: 'BOC',
            level: 1,
          },
          {
            uuid: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
            name: '招商银行',
            icon: 'CMB',
            level: 1,
          },
          {
            uuid: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
            name: '交通银行',
            icon: 'BOCOM',
            level: 1,
          },
          {
            uuid: '9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x',
            name: '中信银行',
            icon: 'CITIC',
            level: 1,
          },
          {
            uuid: '0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y',
            name: '浦发银行',
            icon: 'SPDB',
            level: 1,
          },
          {
            uuid: '1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z',
            name: '光大银行',
            icon: 'CEB',
            level: 1,
          },
          {
            uuid: '2l3m4n5o-6p7q-8r9s-0t1u-2v3w4x5y6z7a',
            name: '广发银行',
            icon: 'CGB',
            level: 1,
          },
          {
            uuid: '3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b',
            name: '其他银行',
            icon: 'bank',
            level: 1,
          },
        ],
      },
      {
        uuid: '4n5o6p7q-8r9s-0t1u-2v3w-4x5y6z7a8b9c',
        name: '信用卡',
        icon: 'credit-card',
        description: '信用卡/蚂蚁花呗/京东白条',
        children: [
          {
            uuid: '5o6p7q8r-9s0t-1u2v-3w4x-5y6z7a8b9c0d',
            name: '蚂蚁花呗',
            icon: 'ant',
            level: 1,
          },
          {
            uuid: '6p7q8r9s-0t1u-2v3w-4x5y-6z7a8b9c0d1e',
            name: '京东白条',
            icon: 'jd',
            level: 1,
          },
          {
            uuid: '7q8r9s0t-1u2v-3w4x-5y6z-7a8b9c0d1e2f',
            name: '苏宁任性付',
            icon: 'suning',
            level: 1,
          },
          {
            uuid: '8r9s0t1u-2v3w-4x5y-6z7a-8b9c0d1e2f3g',
            name: '工商银行',
            icon: 'ICBC',
            level: 1,
          },
          {
            uuid: '9s0t1u2v-3w4x-5y6z-7a8b-9c0d1e2f3g4h',
            name: '建设银行',
            icon: 'CCB',
            level: 1,
          },
          {
            uuid: '0t1u2v3w-4x5y-6z7a-8b9c-0d1e2f3g4h5i',
            name: '农业银行',
            icon: 'ABC',
            level: 1,
          },
          {
            uuid: '1u2v3w4x-5y6z-7a8b-9c0d-1e2f3g4h5i6j',
            name: '中国银行',
            icon: 'BOC',
            level: 1,
          },
          {
            uuid: '2v3w4x5y-6z7a-8b9c-0d1e-2f3g4h5i6j7k',
            name: '招商银行',
            icon: 'CMB',
            level: 1,
          },
          {
            uuid: '3w4x5y6z-7a8b-9c0d-1e2f-3g4h5i6j7k8l',
            name: '交通银行',
            icon: 'BOCOM',
            level: 1,
          },
          {
            uuid: '4x5y6z7a-8b9c-0d1e-2f3g-4h5i6j7k8l9m',
            name: '中信银行',
            icon: 'CITIC',
            level: 1,
          },
          {
            uuid: '5y6z7a8b-9c0d-1e2f-3g4h-5i6j7k8l9m0n',
            name: '浦发银行',
            icon: 'SPDB',
            level: 1,
          },
          {
            uuid: '6z7a8b9c-0d1e-2f3g-4h5i-6j7k8l9m0n1o',
            name: '光大银行',
            icon: 'CEB',
            level: 1,
          },
          {
            uuid: '7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p',
            name: '广发银行',
            icon: 'CGB',
            level: 1,
          },
          {
            uuid: '8b9c0d1e-2f3g-4h5i-6j7k-8l9m0n1o2p3q',
            name: '其他银行',
            icon: 'bank',
            level: 1,
          },
        ],
      },
      {
        uuid: '9c0d1e2f-3g4h-5i6j-7k8l-9m0n1o2p3q4r',
        name: '虚拟账号',
        icon: 'virtual-account',
        description: '支付宝/微信',
        children: [
          {
            uuid: '0d1e2f3g-4h5i-6j7k-8l9m-0n1o2p3q4r5s',
            name: '支付宝',
            icon: 'alipay',
            level: 1,
          },
          {
            uuid: '1e2f3g4h-5i6j-7k8l-9m0n-1o2p3q4r5s6t',
            name: '微信',
            icon: 'wechat',
            level: 1,
          },
          {
            uuid: '2f3g4h5i-6j7k-8l9m-0n1o-2p3q4r5s6t7u',
            name: '其他虚拟账号',
            icon: 'virtual-account',
            level: 1,
          },
        ],
      },
      {
        uuid: '3g4h5i6j-7k8l-9m0n-1o2p-3q4r5s6t7u8v',
        name: '资产账户',
        icon: 'asset-account',
        description: '股票/基金/P2P',
        children: [
          {
            uuid: '4h5i6j7k-8l9m-0n1o-2p3q-4r5s6t7u8v9w',
            name: '股票',
            icon: 'stock',
            level: 1,
          },
          {
            uuid: '5i6j7k8l-9m0n-1o2p-3q4r-5s6t7u8v9w0x',
            name: '基金',
            icon: 'fund',
            level: 1,
          },
          {
            uuid: '6j7k8l9m-0n1o-2p3q-4r5s-6t7u8v9w0x1y',
            name: '其他投资',
            icon: 'other-investment',
            level: 1,
          },
        ],
      },
      {
        uuid: '7k8l9m0n-1o2p-3q4r-5s6t-7u8v9w0x1y2z',
        name: '负债',
        icon: 'debt-liability',
        description: '贷款/借入',
      },
      {
        uuid: '8l9m0n1o-2p3q-4r5s-6t7u-8v9w0x1y2z3a',
        name: '债权',
        icon: 'debt-receivable',
        description: '应收/借出',
      },
      {
        uuid: '9m0n1o2p-3q4r-5s6t-7u8v-9w0x1y2z3a4b',
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
