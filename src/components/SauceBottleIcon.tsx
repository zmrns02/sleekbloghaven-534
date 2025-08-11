import React from 'react';

interface SauceBottleIconProps {
  className?: string;
  color?: string;
}

const SauceBottleIcon: React.FC<SauceBottleIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => {
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
      <path d="M8 3h8l1 3v3a5 5 0 0 1-10 0V6l1-3z" />
      <path d="M7 9v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9" />
      <path d="M12 12c0 0 2-1 2-2.5S13 7 12 7s-2 1-2 2.5 2 2.5 2 2.5z" />
    </svg>
  );
};

export default SauceBottleIcon;