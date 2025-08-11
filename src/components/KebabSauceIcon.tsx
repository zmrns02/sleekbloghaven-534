import React from 'react';

interface KebabSauceIconProps {
  className?: string;
  color?: string;
}

const KebabSauceIcon: React.FC<KebabSauceIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={className} 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 3h12l1 2v4a6 6 0 0 1-14 0V5l1-2z" />
      <path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
      <path d="M8 3v2" />
      <path d="M16 3v2" />
      <path d="M12 10l-2 2" />
      <path d="M14 12l-2 2" />
    </svg>
  );
};

export default KebabSauceIcon;