import { Repository } from 'typeorm';
import { CategoryEntity } from '../../entity/category.entity';
import { CategoryRecord } from '../createDefaultCategory';

export function createCategory(
  rep: Repository<CategoryEntity>,
  categoryArr: CategoryRecord[],
) {
  return rep
    .createQueryBuilder()
    .insert()
    .into('category')
    .values(categoryArr)
    .execute();
}
