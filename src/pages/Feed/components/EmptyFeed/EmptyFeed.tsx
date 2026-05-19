import { Heart } from "lucide-react";

const EmptyFeed = () => {
  return (
    <div className="flex flex-col min-h-200 items-center justify-center py-20 px-8 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Heart size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Здесь пока пусто</h3>
      <p className="text-gray-500 mb-6">
        Подпишитесь на других пользователей или создайте первый пост!
      </p>
      <button
        onClick={() => window.location.href = '/create'}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium"
      >
        Создать пост
      </button>
    </div>
  );
}

export default EmptyFeed