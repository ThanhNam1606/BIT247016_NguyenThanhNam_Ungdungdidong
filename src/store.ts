import AsyncStorage from '@react-native-async-storage/async-storage';
import { P, T } from './config';
import type { Dish, DishCategory, SyncMeta } from './types';

// Thêm tiền tố BIT247016_ vào MỌI tên field trước khi lưu (AsyncStorage + MockAPI)
export const add = (o: unknown): any =>
  Array.isArray(o) ? o.map(add)
  : o && typeof o === 'object'
    ? Object.fromEntries(Object.entries(o).map(([k, v]) => [P + k, add(v)]))
    : o;
// Bỏ tiền tố khi đọc lên để UI dùng tên ngắn (Name, Price...)
export const strip = (o: unknown): any =>
  Array.isArray(o) ? o.map(strip)
  : o && typeof o === 'object'
    ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k.startsWith(P) ? k.slice(P.length) : k, strip(v)]))
    : o;

// Mutex: các thao tác đọc-sửa-ghi chạy lần lượt, tránh ghi đè khi UI và sync chạy cùng lúc
let chain: Promise<unknown> = Promise.resolve();
const lock = <R>(fn: () => Promise<R>): Promise<R> => {
  const r = chain.then(fn);
  chain = r.catch(() => {});
  return r;
};

export async function readAll<E>(table: string): Promise<E[]> {
  try {
    const raw = await AsyncStorage.getItem(table);
    return raw ? (strip(JSON.parse(raw)) as E[]) : [];
  } catch { return []; }
}
export const mutate = <E>(table: string, fn: (list: E[]) => E[]): Promise<E[]> =>
  lock(async () => {
    const next = fn(await readAll<E>(table));
    await AsyncStorage.setItem(table, JSON.stringify(add(next)));
    return next;
  });

// Dữ liệu mẫu: 3 loại + 5 món (Id cố định để không bị trùng khi đồng bộ)
export async function seedIfEmpty(): Promise<void> {
  if ((await readAll(T.cat)).length || (await readAll(T.dish)).length) return;
  const meta: SyncMeta = { RemoteId: null, SyncStatus: 'pending_create', UpdatedAt: Date.now() };
  const catRows: [string, string, string][] = [
    ['cat-1', 'Main course', 'Rice, noodles and mains'],
    ['cat-2', 'Drinks', 'Hot and cold drinks'],
    ['cat-3', 'Dessert', 'Sweet dishes'],
  ];
  const cats: DishCategory[] = catRows.map(([Id, Name, Description]) => ({ Id, Name, Description, ...meta }));
  const img = (s: string) => [
    { ImageUrl: `https://picsum.photos/seed/${s}/600/400`, IsThumbnail: true },
    { ImageUrl: `https://picsum.photos/seed/${s}2/600/400`, IsThumbnail: false },
  ];
  const dishRows: [string, string, number, number, boolean, string][] = [
    ['dish-1', 'Pho bo', 45000, 20, true, 'cat-1'],
    ['dish-2', 'Banh mi', 20000, 10, true, 'cat-1'],
    ['dish-3', 'Ca phe sua', 25000, 5, true, 'cat-2'],
    ['dish-4', 'Tra dao', 30000, 8, false, 'cat-2'],
    ['dish-5', 'Che ba mau', 22000, 15, true, 'cat-3'],
  ];
  const dishes: Dish[] = dishRows.map(([Id, Name, Price, PreparationTime, IsAvailable, DishCategoryId]) =>
    ({ Id, Name, Price, PreparationTime, IsAvailable, Description: Name, DishCategoryId, DishImage: img(Id), ...meta }));
  await mutate<DishCategory>(T.cat, () => cats);
  await mutate<Dish>(T.dish, () => dishes);
}
