import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Если дата в будущем
  if (date > now) {
    return 'только что';
  }
  
  // Используем встроенную функцию date-fns
  return formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: ru,
    includeSeconds: true 
  });
};

// Альтернативная версия с разными форматами
export const formatPostDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  // Если прошло меньше 24 часов - относительный формат
  if (diffInHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  }
  
  // Если прошло меньше 7 дней - день недели
  if (diffInHours < 168) {
    return format(date, 'EEEE', { locale: ru });
  }
  
  // Иначе полная дата
  return format(date, 'd MMMM yyyy', { locale: ru });
};