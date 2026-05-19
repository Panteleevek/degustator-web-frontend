import { Post } from "@/services";
import { Star } from "lucide-react";
import { useRef, useState } from "react";

const Image = ({
  post,
  handleLike,
  isLiked,
}: {
  post: Post;
  handleLike: () => void;
  isLiked: boolean;
}) => {
  const lastTapRef = useRef<number>(0);
  const heartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showHeartAnimation, setShowHeartAnimation] = useState<boolean>(false);
  // Обработчик двойного клика на изображении
  const handleImageDoubleClick = () => {
    // Если еще не лайкнуто, ставим лайк
    if (!isLiked) {
      handleLike();
      showHeartAnimationEffect();
    }
  };

  // Показать анимацию сердечка
  const showHeartAnimationEffect = () => {
    setShowHeartAnimation(true);
    if (heartTimeoutRef.current) {
      clearTimeout(heartTimeoutRef.current);
    }
    heartTimeoutRef.current = setTimeout(() => {
      setShowHeartAnimation(false);
    }, 800);
  };

  // Обработчик тач-событий для мобильных устройств
  const handleImageTouch = (e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Двойной тап
      if (!isLiked) {
        handleLike();
        showHeartAnimationEffect();
      }
      e.preventDefault();
    }

    lastTapRef.current = now;
  };

  return (
    <div
      className="relative aspect-square bg-gray-100"
      onDoubleClick={handleImageDoubleClick}
      onTouchStart={handleImageTouch}
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-full object-cover"
      />

      {/* Rating badge */}
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-2 py-1">
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-white">
            {post.rating}/10
          </span>
        </div>
      </div>
    </div>
  );
};

export default Image;
