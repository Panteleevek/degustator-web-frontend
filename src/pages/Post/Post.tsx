'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from '@/store/hooks';
import { createPost } from '@/store/slices/postsSlice';
import { PRODUCTS, ProductType } from '@/db/database';
import Camera from '@/components/Camera';
import Image from 'next/image';
import PostForm from './components/PostForm';

const Post = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  
  const [step, setStep] = useState<'select' | 'camera' | 'form'>('select');
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Проверка параметра source из URL
  useEffect(() => {
    const source = searchParams.get('source');
    if (source === 'camera') {
      setStep('camera');
    } else if (source === 'gallery') {
      openGallery();
    }
  }, [searchParams]);
  
  const openGallery = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
        setStep('form');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCameraCapture = (data: string) => {
    setImageData(data);
    setStep('form');
  };
  
  return (
    <div className="min-h-screen h-full overflow-auto bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (step === 'form') {
                  setStep('select');
                  setImageData(null);
                } else if (step === 'camera') {
                  setStep('select');
                } else {
                  router.back();
                }
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Назад
            </button>
            <h1 className="text-lg font-semibold">
              {step === 'form' ? 'Новая публикация' : 'Создать пост'}
            </h1>
            <div className="w-10" /> {/* Пустой div для баланса */}
          </div>
        </header>
        
        {/* Шаг 1: Выбор источника */}
        {step === 'select' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📸</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Поделитесь моментом</h2>
              <p className="text-gray-500">Создайте новый пост</p>
            </div>
            
            <div className="w-full space-y-3">
              <button
                onClick={() => setStep('camera')}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium flex items-center justify-center gap-3"
              >
                <span className="text-xl">📸</span>
                  Снять фото
                </button>
                
                <button
                  onClick={openGallery}
                  className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-medium flex items-center justify-center gap-3"
                >
                  <span className="text-xl">🖼️</span>
                  Выбрать из галереи
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
          
          {/* Шаг 2: Камера */}
          {step === 'camera' && (
            <Camera
              onCapture={handleCameraCapture}
              onClose={() => setStep('select')}
            />
          )}
          
          {/* Шаг 3: Форма с данными */}
          {step === 'form' && imageData && (
            <PostForm imageData={imageData}
            />
          )}
        </div>
      </div>
    );
  }
  
  // Компонент формы поста
  // function PostForm({ 
  //   imageData, 
  //   onSubmit, 
  //   loading 
  // }: { 
  //   imageData: string; 
  //   onSubmit: (data: any) => void; 
  //   loading: boolean;
  // }) {
  //   const [formData, setFormData] = useState({
  //     title: '',
  //     rating: 5,
  //     product: PRODUCTS[0] as ProductType,
  //     description: ''
  //   });
    
  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     onSubmit(formData);
  //   };
    
  //   return (
  //     <form onSubmit={handleSubmit} className="p-4 space-y-4">
  //       {/* Превью изображения */}
  //       <div className="relative rounded-xl overflow-hidden bg-gray-100">
  //         <img
  //           src={imageData}
  //           alt="Preview"
  //           className="w-full max-h-[400px] object-contain"
  //         />
  //         <button
  //           type="button"
  //           onClick={() => window.history.back()}
  //           className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full"
  //         >
  //           ✕
  //         </button>
  //       </div>
        
  //       {/* Название */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1">
  //           Название *
  //         </label>
  //         <input
  //           type="text"
  //           value={formData.title}
  //           onChange={(e) => setFormData({...formData, title: e.target.value})}
  //           placeholder="Например: Мой новый смартфон"
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
  //           required
  //         />
  //       </div>
        
  //       {/* Оценка */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1">
  //           Оценка: {formData.rating}/10
  //         </label>
  //         <input
  //           type="range"
  //           min="1"
  //           max="10"
  //           step="1"
  //           value={formData.rating}
  //           onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
  //           className="w-full"
  //         />
  //         <div className="flex justify-between text-xs text-gray-500 mt-1">
  //           <span>1 - Ужасно</span>
  //           <span>5 - Нормально</span>
  //           <span>10 - Шедевр</span>
  //         </div>
  //       </div>
        
  //       {/* Выбор продукта */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1">
  //           Продукт *
  //         </label>
  //         <select
  //           value={formData.product}
  //           onChange={(e) => setFormData({...formData, product: e.target.value as ProductType})}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
  //         >
  //           {PRODUCTS.map((product) => (
  //             <option key={product} value={product}>
  //               {product}
  //             </option>
  //           ))}
  //         </select>
  //       </div>
        
  //       {/* Описание */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1">
  //           Описание
  //         </label>
  //         <textarea
  //           value={formData.description}
  //           onChange={(e) => setFormData({...formData, description: e.target.value})}
  //           placeholder="Расскажите о своем опыте..."
  //           rows={4}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
  //         />
  //       </div>
  //       <div>dsadsad</div>
  //               <div>dsadsad</div>

  //       <div>dsadsad</div>
  //       <div>dsadsad</div>
  //       <div>dsadsad</div>
  //       <div>dsadsad</div>
  //       <div>dsadsad</div>

  //       {/* Кнопка отправки */}
  //       <button
  //         type="submit"
  //         disabled={loading}
  //         className="w-full py-3 bg-blue-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  //       >
  //         {loading ? 'Публикация...' : 'Опубликовать'}
  //       </button>
  //     </form>
  //   );
  // }

  export default Post