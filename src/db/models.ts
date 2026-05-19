export interface Post {
  id: string;
  userId: string;
  imageData: string; // base64 или blob URL
  title: string;
  rating: number; // 1-10
  product: string;
  description: string;
  createdAt: number;
  likes: string[]; // массив userId, кто лайкнул
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  createdAt: number;
}

// Список продуктов для выбора
export const PRODUCTS = [
  'Смартфон', 'Ноутбук', 'Наушники', 'Камера', 
  'Книга', 'Одежда', 'Обувь', 'Косметика', 
  'Еда', 'Другое'
] as const;

export type ProductType = typeof PRODUCTS[number];