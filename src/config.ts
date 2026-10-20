// ===== MSSV: dùng cho tên project, Table (key AsyncStorage / resource MockAPI) và tên field =====
export const MSSV = 'BIT247016';
export const P = MSSV + '_';                       // tiền tố bắt buộc
export const T = {
  dish: P + 'Dish',                                // Table Dish
  cat: P + 'DishCategory',                         // Table DishCategory
  lang: P + 'Lang',
} as const;
// TODO: thay bằng URL project MockAPI của bạn (không có dấu / ở cuối)
export const API_URL = 'https://6ad718a4f71f154ac487c28d.mockapi.io/api/v1/:endpoint';
