import { Post } from "@/services";
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Actions = ({
  handleLike,
  isLiked,
  post,
  handleFavorite,
  isFavorite,
}: {
  handleLike: () => void;
  isLiked: boolean;
  post: Post;
  handleFavorite: () => void;
  isFavorite: boolean;
}) => {
  return (
    <div className="flex items-center justify-between px-4 pt-3">
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className="transition-transform active:scale-90"
        >
          <Heart
            size={24}
            className={isLiked ? "fill-red-500 text-red-500" : "text-gray-700"}
          />
        </button>

        <Link href={`/post/${post.id}`}>
          <MessageCircle
            size={24}
            className="text-gray-700 hover:text-gray-500 transition-colors"
          />
        </Link>

        <button className="transition-transform active:scale-90">
          <Send size={24} className="text-gray-700 hover:text-gray-500" />
        </button>
      </div>

      <button
        onClick={handleFavorite}
        className="transition-transform active:scale-90"
      >
        <Bookmark
          size={24}
          className={isFavorite ? "fill-gray-900 text-gray-900" : "text-gray-700"}
        />
      </button>
    </div>
  );
};

export default Actions;
