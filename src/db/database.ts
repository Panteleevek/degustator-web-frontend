import Dexie, { Table } from 'dexie';

// Определяем типы здесь, чтобы избежать циклических зависимостей
export interface User {
  id: string;
  username: string;
  avatar?: string;
  createdAt: number;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
}

export interface Post {
  id: string;
  userId: string;
  imageData: string;
  title: string;
  rating: number;
  product: string;
  description: string;
  createdAt: number;
  likes: string[];
  comments: Comment[];
}
export const PRODUCTS = [
  'Смартфон', 'Ноутбук', 'Наушники', 'Камера', 
  'Книга', 'Одежда', 'Обувь', 'Косметика', 
  'Еда', 'Другое'
] as const;

// Тип продукта на основе списка
export type ProductType = typeof PRODUCTS[number];

export class AppDatabase extends Dexie {
  posts!: Table<Post, string>;
  users!: Table<User, string>;

  constructor() {
    super('InstagramCloneDB');
    this.version(1).stores({
      posts: 'id, userId, title, rating, createdAt, product',
      users: 'id, username, avatar, createdAt'
    });
  }
}

export const db = new AppDatabase();

// Инициализация демо данных
export const initDatabase = async () => {
  // Проверяем есть ли пользователи
  const userCount = await db.users.count();
  if (userCount === 0) {
    // Создаем демо пользователя
    await db.users.add({
      id: 'user1',
      username: 'Демо Пользователь',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      createdAt: Date.now()
    });

    // Создаем несколько демо постов
    const demoPosts: Omit<Post, 'id'>[] = [
      {
        userId: 'user1',
        imageData: 'https://picsum.photos/id/1015/400/400',
        title: 'Красивый закат',
        rating: 9,
        product: 'Камера',
        description: 'Потрясающий закат над горами!',
        createdAt: Date.now() - 86400000,
        likes: [],
        comments: []
      },
      {
        userId: 'user1',
        imageData: 'https://picsum.photos/id/104/400/400',
        title: 'Мой новый ноутбук',
        rating: 8,
        product: 'Ноутбук',
        description: 'Отличная производительность!',
        createdAt: Date.now() - 172800000,
        likes: [],
        comments: []
      }
    ];

    for (const post of demoPosts) {
      await db.posts.add({
        ...post,
        id: Date.now().toString() + Math.random()
      });
    }
  }
};