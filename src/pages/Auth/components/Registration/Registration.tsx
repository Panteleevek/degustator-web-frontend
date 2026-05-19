import { User, useRegisterMutation } from "@/services";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const Registration = () => {
  const router = useRouter();
  const [registration, registrationResult] = useRegisterMutation();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const isValid = useMemo(
    () => values.username && values.fullName && values.email && values.password,
    [values],
  );

  // Регистрация нового пользователя
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const newUser: User = {
      username: values.username,
      email: values.email,
      password: values.password,
      fullName: values.fullName,
    };

    registration(newUser);
    router.push("/");
  };

  const handleChange = (val: string, name: string) => {
    return setValues({ ...values, [name]: val });
  };

  return (
    <form onSubmit={handleRegister} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ваш логин
        </label>
        <input
          type="text"
          value={values.username}
          onChange={(e) => handleChange(e.target.value, "username")}
          placeholder="Логин"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Имя пользователя *
        </label>
        <input
          type="text"
          value={values.fullName}
          onChange={(e) => handleChange(e.target.value, "fullName")}
          placeholder="Имя пользователя"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Будет отображаться в вашем профиле
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Почта пользователя
        </label>
        <input
          type="email"
          value={values.email}
          onChange={(e) => handleChange(e.target.value, "email")}
          placeholder="Почта пользователя"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Пароль пользователя *
        </label>
        <input
          type="password"
          value={values.password}
          onChange={(e) => handleChange(e.target.value, "password")}
          placeholder="Пароль"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <button
        type="submit"
        disabled={!isValid.trim() || registrationResult.isLoading}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
      >
        {registrationResult.isLoading ? "Создание..." : "Создать аккаунт"}
      </button>
    </form>
  );
};

export default Registration;
