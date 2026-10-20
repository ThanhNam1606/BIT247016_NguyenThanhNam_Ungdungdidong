import type { Lang } from './types';

const en = {
  dishes: 'Dishes', add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel', back: 'Back',
  search: 'Search by name', all: 'All', onlyAvailable: 'Available only', minPrice: 'Min price', maxPrice: 'Max price',
  sort: 'Sort', sortNone: 'None', sortPriceAsc: 'Price ↑', sortPriceDesc: 'Price ↓', sortTimeAsc: 'Time ↑',
  name: 'Name', price: 'Price', prepTime: 'Preparation time (min)', min: 'min', description: 'Description',
  category: 'Category', categories: 'Categories', available: 'Available', unavailable: 'Unavailable',
  images: 'Images', imageUrl: 'Image URL', addImage: 'Add image', setThumbnail: 'Set thumbnail', thumbnail: 'Thumbnail',
  remove: 'Remove', quick: 'Quick', regular: 'Regular', noDishes: 'No dishes found', noImages: 'No images',
  noCategories: 'No categories', notFound: 'Dish not found', addDish: 'Add dish', editDish: 'Edit dish',
  addCategory: 'Add category', editCategory: 'Edit category', confirmTitle: 'Confirm', confirmDish: 'Delete this dish?',
  confirmCat: 'Delete this category?', offline: 'Offline', online: 'Online', pending: 'pending',
  errNameRequired: 'Name is required', errNameDuplicate: 'Dish name already exists in this category',
  errPrice: 'Price must be a number > 0', errTime: 'Preparation time must be a number > 0',
  errCategory: 'Please choose a valid category', errPriceRange: 'Invalid price range',
  errImageUrl: 'Invalid image URL', errCategoryInUse: 'Category is in use and cannot be deleted',
  errSave: 'Could not save data',
};
export type TKey = keyof typeof en;

const vi: Record<TKey, string> = {   // thiếu key nào TypeScript báo lỗi ngay
  dishes: 'Món ăn', add: 'Thêm', edit: 'Sửa', delete: 'Xóa', save: 'Lưu', cancel: 'Hủy', back: 'Quay lại',
  search: 'Tìm theo tên', all: 'Tất cả', onlyAvailable: 'Chỉ món đang bán', minPrice: 'Giá từ', maxPrice: 'Giá đến',
  sort: 'Sắp xếp', sortNone: 'Mặc định', sortPriceAsc: 'Giá ↑', sortPriceDesc: 'Giá ↓', sortTimeAsc: 'Thời gian ↑',
  name: 'Tên', price: 'Giá', prepTime: 'Thời gian chế biến (phút)', min: 'phút', description: 'Mô tả',
  category: 'Loại món', categories: 'Loại món ăn', available: 'Đang bán', unavailable: 'Ngừng bán',
  images: 'Hình ảnh', imageUrl: 'Link ảnh', addImage: 'Thêm ảnh', setThumbnail: 'Đặt ảnh đại diện', thumbnail: 'Ảnh đại diện',
  remove: 'Gỡ', quick: 'Nhanh', regular: 'Thông thường', noDishes: 'Không có món ăn', noImages: 'Chưa có ảnh',
  noCategories: 'Chưa có loại món', notFound: 'Không tìm thấy món ăn', addDish: 'Thêm món', editDish: 'Sửa món',
  addCategory: 'Thêm loại', editCategory: 'Sửa loại', confirmTitle: 'Xác nhận', confirmDish: 'Xóa món ăn này?',
  confirmCat: 'Xóa loại món này?', offline: 'Ngoại tuyến', online: 'Trực tuyến', pending: 'chờ đồng bộ',
  errNameRequired: 'Tên không được để trống', errNameDuplicate: 'Tên món đã tồn tại trong loại này',
  errPrice: 'Giá phải là số > 0', errTime: 'Thời gian chế biến phải là số > 0',
  errCategory: 'Vui lòng chọn loại món hợp lệ', errPriceRange: 'Khoảng giá không hợp lệ',
  errImageUrl: 'Link ảnh không hợp lệ', errCategoryInUse: 'Loại món đang được sử dụng, không thể xóa',
  errSave: 'Không thể lưu dữ liệu',
};
export const DICT: Record<Lang, Record<TKey, string>> = { en, vi };
