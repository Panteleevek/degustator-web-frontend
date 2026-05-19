'use client';

import { useState } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';

const Auth =() => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center p-4">
        
        {/* Карточка авторизации */}
        <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden">
          
          {/* Логотип/Заголовок */}
          <div className="text-center pt-8 pb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-4xl">📸</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InstaClone
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Делитесь моментами с друзьями
            </p>
          </div>
          
          {/* Вкладки */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                isLogin 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                !isLogin 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Регистрация
            </button>
          </div>
          
          {/* Форма входа */}
          {isLogin && <Login />}
          
          {/* Форма регистрации */}
          {!isLogin && <Registration />}
          
          {/* Демо-подсказка */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              🔐 Демо-версия. Все данные хранятся локально в вашем браузере.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth