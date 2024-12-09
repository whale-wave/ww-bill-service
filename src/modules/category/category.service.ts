import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, ObjectLiteral, Repository } from 'typeorm';
import { createDefaultCategoryExpend, createDefaultCategoryIncome, fail, getFileHash, qiniuOss } from '../../utils';
import { createCategory } from '../../utils/compatible/category';
import { UserEntity } from '../../entity/user.entity';
import { CategoryEntity } from '../../entity/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(options: FindOneOptions<CategoryEntity>) {
    return this.categoryRepository.find(options);
  }

  async create(
    userId: number,
    { name }: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne(userId);
    const findFromName = await this.categoryRepository.findOne({
      user,
      name,
    });
    if (findFromName)
      return fail('分类名称已存在');

    const { url } = await qiniuOss.uploadFile(
      file,
      getFileHash(file),
      `/user_${user.username}/`,
    );

    const category = new CategoryEntity();
    category.user = user;
    category.name = name;
    category.icon = url;
    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOneById(id);
    if (!category)
      return fail('分类不存在');
    return this.categoryRepository.remove(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOneById(id);
    if (!category)
      return fail('分类不存在');
    return this.categoryRepository.update(category, updateCategoryDto);
  }

  findOneById(id: string) {
    return this.categoryRepository.findOne(id);
  }

  async findAll(userId: number, type = '-') {
    const options = {
      where: { user: userId, type },
      order: { id: 'DESC' },
    } as ObjectLiteral;
    const hasExpend = await this.categoryRepository.findOne({
      where: { user: userId, type: 'sub', icon: 'catering' },
    });
    const hasIncome = await this.categoryRepository.findOne({
      where: { user: userId, type: 'add', icon: 'part-time' },
    });
    if (!hasIncome) {
      await createCategory(
        this.categoryRepository,
        createDefaultCategoryIncome(`${userId}`),
      );
    }
    if (!hasExpend) {
      await createCategory(
        this.categoryRepository,
        createDefaultCategoryExpend(`${userId}`),
      );
    }
    const [data, total] = await this.categoryRepository.findAndCount(options);
    return { data, total };
  }
}
