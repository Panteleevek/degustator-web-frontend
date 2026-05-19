import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100,
}: UseInfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            onLoadMore();
          }
        },
        { threshold: 0.1, rootMargin: `${threshold}px` }
      );
      
      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore, onLoadMore, threshold]
  );
  
  return { lastElementRef };
}

export default useInfiniteScroll