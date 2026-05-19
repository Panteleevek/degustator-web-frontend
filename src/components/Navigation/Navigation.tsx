'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from '@/store/hooks';
import { Home, Compass, PlusCircle, User, Heart, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import AvatarIcon from '@/statics/svg/AvatarIcon';

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const { posts } = useSelector(state => state.posts);
  
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  // Подсчет уведомлений (пример)
  useEffect(() => {
    // Здесь можно добавить логику подсчета непрочитанных уведомлений
    // Например, новые лайки или комментарии
    const unreadNotifications = localStorage.getItem('unreadNotifications');
    if (unreadNotifications) {
      setNotificationsCount(JSON.parse(unreadNotifications).length);
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path === '/explore') return pathname === '/explore';
        if (path === '/create') return pathname === '/create';
    if (path === '/profile') return pathname.startsWith('/profile');
    if (path === '/notifications') return pathname === '/notifications';
    return pathname === path;
  };
const profilePath = currentUser ? `/profile/${currentUser.id}` : '/profile/me';

  const navItems = [
    {
      id: 'home',
      name: 'Главная',
      path: '/',
      icon: <Home size={24} strokeWidth={1.5} />,
      activeIcon: <Home size={24} fill="currentColor" strokeWidth={1.5} />,
    },
    {
      id: 'explore',
      name: 'Поиск',
      path: '/search',
      icon: <Compass size={24} strokeWidth={1.5} />,
      activeIcon: <Compass size={24} fill="currentColor" strokeWidth={1.5} />,
    },
    {
      id: 'create',
      name: 'Создать',
      path: '/create',
      icon: <PlusCircle size={24} strokeWidth={1.5} />,
      activeIcon: <PlusCircle size={24} fill="currentColor" strokeWidth={1.5} />,
      isCreate: true,
    },
    {
      id: 'favorite',
      name: 'Избранное',
      path: '/favorite',
      icon: <Bookmark size={24} strokeWidth={1.5} />,
      activeIcon: <Bookmark size={24} fill="currentColor" strokeWidth={1.5} />,
    },
    {
      id: 'profile',
      name: 'Профиль',
      path: profilePath,
      icon: currentUser?.avatar ? (
        <img 
          src={currentUser.avatar} 
          alt="avatar" 
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <AvatarIcon size={24} />
      ),
      activeIcon: <User size={24} fill="currentColor" strokeWidth={1.5} />,
    },
  ];

  const handleCreatePost = () => {
    setShowCreateMenu(true);
  };

  const handleCreateOption = (type: 'camera' | 'gallery') => {
    setShowCreateMenu(false);
    router.push(`/create?source=${type}`);
  };

  return (
    <>
      {/* Нижняя навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-2 z-40 ">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
             
                className={`
                  relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200
                  ${isActive(item.path) 
                    ? 'text-blue-500 scale-105' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <div className="relative">
                  {isActive(item.path) ? item.activeIcon : item.icon}
                </div>
                
                <span className={`text-xs ${isActive(item.path) ? 'font-semibold' : ''}`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Отступ для контента */}
      <div className="pb-20" />
    </>
  );
}
export default Navigation