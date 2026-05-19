const AvatarIcon = ({ size = 100, className = '' }: { size?: number; className?: string}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`rounded-full ${className}`}
      style={{ backgroundColor: '#E5E7EB' }}
    >
      {/* Камера */}
      <circle cx="50" cy="50" r="45" fill="#9CA3AF" />
      <circle cx="50" cy="50" r="35" fill="#D1D5DB" />
      
      {/* Объектив */}
      <circle cx="50" cy="50" r="15" fill="#6B7280" />
      <circle cx="50" cy="50" r="8" fill="#374151" />
      <circle cx="50" cy="50" r="3" fill="#1F2937" />
      
      {/* Вспышка */}
      <rect x="35" y="30" width="6" height="4" rx="1" fill="#9CA3AF" />
      
      {/* Кнопка */}
      <rect x="68" y="35" width="8" height="6" rx="2" fill="#6B7280" />
    </svg>
  );
}

export default AvatarIcon;