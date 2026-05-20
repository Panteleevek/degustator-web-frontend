"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { useToggleLikeMutation } from "@/services";
import { formatPostDate } from "@/utils/dateUtils";
import Image from "./components/Image";
import Actions from "./components/Actions";
import Avatar from "@/components/Avatar";
import { useToggleFavoriteMutation } from "@/services/postApi";

interface FeedCardProps {
  post: {
    id: string;
    userId: string;
    imageUrl: string;
    title: string;
    rating: number;
    product: string;
    description: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    isFavorite?: boolean;
    createdAt: string;
    User: {
      id: string;
      username: string;
      fullName: string;
      avatar: string;
    };
  };
  isShort?: boolean;
  haveId?: boolean;
}

const FeedCard = ({ post, isShort, haveId }: FeedCardProps) => {
  const router = useRouter();
  const [toggleLike] = useToggleLikeMutation();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setFavorite] = useState(post?.isFavorite);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    try {
      await toggleLike(post.id).unwrap();
    } catch (error) {
      // Откат при ошибке
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    }
  };

  const handleFavorite = async () => {
    setFavorite(!isFavorite);
    try {
      await toggleFavorite(post.id).unwrap();
    } catch (error) {
      // Откат при ошибке
      setFavorite(isFavorite);
    }
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return showFullDescription ? text : text.slice(0, maxLength) + "...";
  };

  if (isShort) {
    return (
      <Link href={`/post/${post.id}`} className="flex items-center gap-3">
        <Image
          post={post}
          handleLike={handleLike}
          isLiked={isLiked}
          showProduct
        />
      </Link>
    );
  }
  return (
    <article className="h-full bg-white border-b border-gray-100 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          href={`/profile/${post.User.id}`}
          className="flex items-center gap-3"
        >
          {haveId && (
            <button
              onClick={() => router.back()}
              className="text-gray-600 text-3xl mr-2"
            >
              ←
            </button>
          )}

          <Avatar user={post.User} />
          <div>
            <p className="font-semibold text-sm text-gray-900">
              {post.User.username}
            </p>
            <p className="text-xs text-gray-400">
              {formatPostDate(post.createdAt)}
            </p>
          </div>
        </Link>

        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <Image post={post} handleLike={handleLike} isLiked={isLiked} />
      <Actions
        post={post}
        handleLike={handleLike}
        isLiked={isLiked}
        handleFavorite={handleFavorite}
        isFavorite={isFavorite}
      />

      {/* Likes */}
      {likesCount > 0 && (
        <div className="px-4 pt-2">
          <p className="text-sm font-semibold text-gray-900">
            {likesCount.toLocaleString()}{" "}
            {likesCount === 1 ? "лайк" : likesCount < 5 ? "лайка" : "лайков"}
          </p>
        </div>
      )}

      {/* Description */}
      <div className="px-4 pt-1">
        <Link
          href={`/profile/${post.User.id}`}
          className="font-semibold text-sm text-gray-900 mr-2"
        >
          {post.User.username}
        </Link>
        <span className="text-sm text-gray-700">
          {truncateText(post.description)}
        </span>
        {post.description.length > 120 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-xs text-gray-400 ml-1"
          >
            {showFullDescription ? "скрыть" : "ещё"}
          </button>
        )}
      </div>

      {/* Product tag */}
      {post.product && (
        <div className="px-4 pt-2">
          <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            📦 {post.product}
          </span>
        </div>
      )}

      {/* Comments link */}
      {post.commentsCount > 0 && (
        <Link href={`/post/${post.id}`}>
          <p className="px-4 pt-2 text-xs text-gray-400">
            Посмотреть все {post.commentsCount} комментариев
          </p>
        </Link>
      )}

      {/* Title */}
      {post.title && (
        <div className="px-4 pt-1 pb-2">
          <p className="font-medium text-sm text-gray-800">{post.title}</p>
        </div>
      )}
    </article>
  );
};

export default FeedCard;
