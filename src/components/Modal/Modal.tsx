'use client';

import { useEffect, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: '60%' | '70%' | '80%' | 'auto';
  title?: string;
  showDragHandle?: boolean;
  closeOnBackdrop?: boolean;
  closeOnSwipe?: boolean;
}

 const Modal =({
  isOpen,
  onClose,
  children,
  height = '80%',
  title,
  showDragHandle = true,
  closeOnBackdrop = true,
  closeOnSwipe = true,
}: BottomSheetModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Высота модалки
  const heightMap = {
    '60%': 'h-3/5',
    '70%': 'h-[70%]',
    '80%': 'h-4/5',
    'auto': 'h-auto',
  };
  
  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsVisible(true);
    } else {
      document.body.style.overflow = '';
      setIsVisible(false);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);
  
  // Обработка свайпа вниз для закрытия
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!closeOnSwipe) return;
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!closeOnSwipe || !isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) {
      setCurrentY(deltaY);
      const modal = document.getElementById('bottom-sheet-content');
      if (modal) {
        modal.style.transform = `translateY(${deltaY}px)`;
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (!closeOnSwipe) return;
    setIsDragging(false);
    if (currentY > 100) {
      handleClose();
    }
    setCurrentY(0);
    const modal = document.getElementById('bottom-sheet-content');
    if (modal) {
      modal.style.transform = '';
    }
  };
  
  if (!mounted) return null;
  
  return createPortal(
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isVisible ? 'visible' : 'invisible'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={closeOnBackdrop ? handleClose : undefined}
      />
      
      {/* Modal Content */}
      <div
        id="bottom-sheet-content"
        className={`
          absolute bottom-0 left-0 right-0
          bg-white rounded-t-3xl shadow-2xl
          transition-transform duration-300 ease-out
          ${heightMap[height]}
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        {showDragHandle && (
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
        )}
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-56px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal