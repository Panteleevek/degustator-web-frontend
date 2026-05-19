"use client";

import { useState } from "react";
import { PRODUCTS, ProductType } from "@/db/models";
import { useCreatePostMutation } from "@/services";
import { useRouter } from "next/navigation";

interface PostFormProps {
  imageData: string;
}

const PostForm = ({ imageData }: PostFormProps) => {
  const router = useRouter();
  const [createPost, postResult] = useCreatePostMutation();
  const [formData, setFormData] = useState({
    title: "",
    rating: 5,
    product: PRODUCTS[0] as ProductType,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("imageData", imageData); // ✅ File объект, не base64
    data.append("title", formData.title);
    data.append("rating", formData.rating.toString());
    data.append("product", formData.product);
    data.append("description", formData.description);

    createPost(data);
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <img src={imageData} alt="Preview" className="w-full rounded-lg" />

      <input
        type="text"
        placeholder="Название"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-2 border rounded-lg"
        required
      />

      <div>
        <label>Оценка: {formData.rating}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.rating}
          onChange={(e) =>
            setFormData({ ...formData, rating: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <select
        value={formData.product}
        onChange={(e) =>
          setFormData({ ...formData, product: e.target.value as ProductType })
        }
        className="w-full p-2 border rounded-lg"
      >
        {PRODUCTS.map((product) => (
          <option key={product} value={product}>
            {product}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Описание"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full p-2 border rounded-lg"
        rows={4}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-lg"
        disabled={postResult.isLoading}
      >
        Опубликовать
      </button>
    </form>
  );
};

export default PostForm;
