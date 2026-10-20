import type { Dish, DishCategory, DishFormState } from './types';
import type { TKey } from './i18n';

export type FormErrors = Partial<Record<'Name' | 'Price' | 'PreparationTime' | 'DishCategoryId', TKey>>;

export function validateDish(d: DishFormState, dishes: Dish[], cats: DishCategory[]): FormErrors {
  const e: FormErrors = {};
  if (!d.Name.trim()) e.Name = 'errNameRequired';
  const price = Number(d.Price);
  if (d.Price === '' || isNaN(price) || price <= 0) e.Price = 'errPrice';
  const time = Number(d.PreparationTime);
  if (d.PreparationTime === '' || isNaN(time) || time <= 0) e.PreparationTime = 'errTime';
  if (!cats.some((c) => c.Id === d.DishCategoryId)) e.DishCategoryId = 'errCategory';
  else if (!e.Name && dishes.some((x) => x.Id !== d.Id && x.DishCategoryId === d.DishCategoryId
      && x.Name.trim().toLowerCase() === d.Name.trim().toLowerCase())) e.Name = 'errNameDuplicate';
  return e;
}
export const isUrl = (u: string): boolean => /^https?:\/\/\S+$/i.test(u.trim());
