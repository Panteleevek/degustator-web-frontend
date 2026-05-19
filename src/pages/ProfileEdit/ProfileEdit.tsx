import { User, useUpdateProfileMutation } from "@/services";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, X, Loader2, Eye, EyeOff } from "lucide-react";
import {
  useUpdateAvatarMutation,
  useDeleteAvatarMutation,
} from "@/services/userApi";

const ProfileEdit = ({ currentUser }: { currentUser: User }) => {
  const router = useRouter();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isUploadingAvatar }] =
    useUpdateAvatarMutation();
  const [deleteAvatar, { isLoading: isDeletingAvatar }] =
    useDeleteAvatarMutation();

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    bio: currentUser?.bio || "",
    email: currentUser?.email || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

 const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // Проверка типа
  if (!file.type.startsWith('image/')) {
    setErrors({ avatar: 'Пожалуйста, выберите изображение' });
    return;
  }
  
  // Проверка размера
  if (file.size > 5 * 1024 * 1024) {
    setErrors({ avatar: 'Размер изображения не должен превышать 5MB' });
    return;
  }
  
  // ✅ Конвертируем в base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result as string;
    setPreviewAvatar(base64String);
    
    // Отправляем base64 на сервер
    try {
      const result = await updateAvatar({ avatar: base64String }).unwrap();
      setShowMenu(false);
      setPreviewAvatar(null);
      onAvatarUpdate?.(result.avatar);
    } catch (error: any) {
      setErrors({ avatar: error.data?.message || 'Ошибка при загрузке' });
    }
  };
  reader.readAsDataURL(file);
};
  // ✅ Обработка удаления аватара
  const handleDeleteAvatar = async () => {
    if (!confirm("Вы уверены, что хотите удалить аватар?")) return;

    try {
      await deleteAvatar().unwrap();
      setShowAvatarMenu(false);
      setPreviewAvatar(null);
      setErrors({});
    } catch (error: any) {
      setErrors({
        avatar: error.data?.message || "Ошибка при удалении аватара",
      });
    }
  };

  // ✅ Отмена предпросмотра
  const handleCancelPreview = () => {
    setPreviewAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!!formData.newPassword || formData.newPassword !== '') {
  console.log('newPassword', formData.newPassword)

      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = "Пароль должен содержать минимум 6 символов";
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(1, formData.newPassword)

    e.preventDefault();
    if (!validate()) return;

    const updateData: any = {
      fullName: formData.fullName,
      bio: formData.bio,
      email: formData.email,
    };

    if (formData.newPassword) {
      updateData.newPassword = formData.newPassword;
    }

    try {
      await updateProfile(updateData).unwrap();
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      // Показываем сообщение об успехе
      alert("Профиль успешно обновлен");
    } catch (error: any) {
      setErrors({
        submit: error.data?.message || "Ошибка при обновлении профиля",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="text-gray-600">
              ← Назад
            </button>
            <h1 className="font-semibold text-lg">Редактирование профиля</h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center py-6 border-b border-gray-100">
          <div className="relative">
            {/* Avatar image with edit overlay */}
            <div
              className="relative rounded-full cursor-pointer group"
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            >
              <img
                src={
                  previewAvatar ||
                  currentUser?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.username || "User")}&background=6366F1&color=fff&size=150`
                }
                alt={currentUser?.username}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
            </div>

            {/* Avatar Menu */}
            {showAvatarMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAvatarMenu(false)}
                />
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px]">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {previewAvatar ? (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg flex items-center gap-2"
                      >
                        {isUploadingAvatar ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Camera size={16} />
                        )}
                        <span>Выбрать другое</span>
                      </button>
                      <button
                        onClick={handleCancelPreview}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <X size={16} />
                        <span>Отменить</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg flex items-center gap-2"
                      >
                        {isUploadingAvatar ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Camera size={16} />
                        )}
                        <span>Загрузить фото</span>
                      </button>
                      {!currentUser?.avatar?.includes("ui-avatars.com") && (
                        <button
                          onClick={handleDeleteAvatar}
                          disabled={isDeletingAvatar}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-500 rounded-b-lg flex items-center gap-2"
                        >
                          {isDeletingAvatar ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <X size={16} />
                          )}
                          <span>Удалить</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Нажмите на аватар для изменения
          </p>
          {errors.avatar && (
            <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>
          )}
        </div>

        {/* Form */}
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Полное имя
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                О себе
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Расскажите о себе..."
              />
            </div>
            {/* Password Change Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Смена пароля
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Оставьте поля пустыми, если не хотите менять пароль
              </p>

              {/* New Password */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Новый пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Минимум 6 символов"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Подтвердите новый пароль
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">
                {errors.submit}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
              >
                {isUpdatingProfile ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
