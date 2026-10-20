export type Lang = 'en' | 'vi';
export type SyncStatus = 'synced' | 'pending_create' | 'pending_update' | 'pending_delete';

// Trường kỹ thuật phục vụ offline/sync (khi lưu cũng được gắn tiền tố BIT247016_)
export interface SyncMeta {
  RemoteId: string | null;   // id do MockAPI cấp (null nếu chưa đẩy lên)
  SyncStatus: SyncStatus;
  UpdatedAt: number;
}
export interface DishImage { ImageUrl: string; IsThumbnail: boolean }
export interface DishCategory extends SyncMeta { Id: string; Name: string; Description: string }
export interface Dish extends SyncMeta {
  Id: string; Name: string; Price: number; PreparationTime: number; IsAvailable: boolean;
  Description: string; DishCategoryId: string; DishImage: DishImage[];
}
export type Entity = Dish | DishCategory;
export type DishInput = Omit<Dish, keyof SyncMeta>;
export type CategoryInput = Omit<DishCategory, keyof SyncMeta>;
// State của form: Price/PreparationTime là chuỗi để nhập liệu
export type DishFormState = Omit<DishInput, 'Price' | 'PreparationTime'> & { Price: string; PreparationTime: string };

export type SortKey = '' | 'priceAsc' | 'priceDesc' | 'timeAsc';
export interface Filters {
  search: string; categoryId: string; onlyAvailable: boolean; min: string; max: string; sort: SortKey;
}
export type RootStackParamList = {
  List: undefined;
  Detail: { id: string };
  Form: { id?: string } | undefined;
  Categories: undefined;
};
