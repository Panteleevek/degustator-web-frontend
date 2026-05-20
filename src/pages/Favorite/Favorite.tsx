import FeedCard from "@/components/FeedCard";
import { useGetFavoritesQuery } from "@/services/postApi";
import { useLazySearchFavoritesQuery } from "@/services/searchApi";
import { useCallback, useMemo, useState } from "react";
import debounce from "lodash.debounce";

const Favorite = () => {
  const favorites = useGetFavoritesQuery({});
  const [value, setValue] = useState("");

  const [searchFavorites, searchFavoritesResult] = useLazySearchFavoritesQuery(
    {},
  );

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      console.log(`Выполняем поиск для: ${query}`);
      searchFavorites({ q: query });
    }, 500), // Задержка 500 мс [citation:1]
    [searchFavoritesResult], // Функция пересоздастся только при изменении `refetch`
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setValue(value);
    debouncedSearch(value);
  };

  const listFavorites = useMemo(() => {
    if (
      Array.isArray(searchFavoritesResult?.data?.posts) &&
      searchFavoritesResult?.isSuccess
    ) {
      return searchFavoritesResult?.data.posts;
    }
    return favorites?.data?.posts;
  }, [
    favorites,
    searchFavoritesResult?.data,
    searchFavoritesResult?.isSuccess,
    searchFavoritesResult?.isError,
  ]);

  const listFavoritesEmpty = useMemo(
    () => Array.isArray(listFavorites) && listFavorites.length === 0,
    [listFavorites],
  );

  const renderFavorites = () => {
    if (Array.isArray(listFavorites)) {
      if (listFavoritesEmpty) {
        return <div>Список избранного пуст</div>;
      }

      return listFavorites.map((item) => {
        return <FeedCard post={item} isShort />;
      });
    }
  };
  
  return (
    <div className="bg-white h-full w-full">
      <div className="text-center pt-6 text-[22px] font-bold">Избранное</div>
      <div className="mx-auto pt-6 px-2">
        <div className="mb-6">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Поиск..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-s"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-1">{renderFavorites()}</div>
      </div>
    </div>
  );
};

export default Favorite;
