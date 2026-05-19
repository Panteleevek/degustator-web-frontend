'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGetFeedQuery } from '@/services';
import LoadingFeed from './components/LoadingFeed';
import useInfiniteScroll from './hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';
import FeedCard from '@/components/FeedCard';
import { useGetAllPostsQuery } from '@/services/postApi';

const Search = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  const { data, isLoading, isFetching, isError, refetch } = useGetAllPostsQuery({
    page,
    limit: 10,
  });
  
  // Обновляем посты при получении новых данных
  useEffect(() => {
    if (data?.posts) {
      if (page === 1) {
        setAllPosts(data.posts);
      } else {
        setAllPosts((prev) => [...prev, ...data.posts]);
      }
      // Проверяем, есть ли еще посты
      setHasMore(data.posts.length === 10 && page < data.pages);
    }
  }, [data, page]);
  
  // Загрузка следующей страницы
  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);
  
  // Хук бесконечной прокрутки
  const { lastElementRef } = useInfiniteScroll({
    hasMore,
    isLoading: isFetching,
    onLoadMore: loadMore,
    threshold: 200,
  });
  
  // Скелетоны для загрузки
  const skeletonCount = 3;
  
  if (isLoading && page === 1) {
    return (
      <div className="divide-y divide-gray-100">
        {[...Array(skeletonCount)].map((_, i) => (
          <LoadingFeed key={i} />
        ))}
      </div>
    );
  }
  
  if (isError && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">😢</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">Ошибка загрузки</h2>
        <p className="text-gray-500 mb-4">Не удалось загрузить ленту</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Повторить
        </button>
      </div>
    );
  }
  
  if (!allPosts || allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📷</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">Нет постов</h2>
        <p className="text-gray-500 mb-4">
          Подпишитесь на друзей или создайте первый пост
        </p>
        <button
          onClick={() => (window.location.href = '/create')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Создать пост
        </button>
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-100 min-h-screen bg-gray-50">
      {allPosts.map((post, index) => (
        <div
          key={post.id}
          ref={index === allPosts.length - 1 ? lastElementRef : null}
        >
          <FeedCard post={post} />
        </div>
      ))}
      
      {/* Индикатор загрузки */}
      {isFetching && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
      
      {/* Конец ленты */}
      {!hasMore && allPosts.length > 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          Вы просмотрели все посты 🎉
        </div>
      )}
    </div>
  );
}

export default Search