import React from 'react';

interface BadgeProps {
  color?: string;
  borderColor?: string;
  bgColor?: string;
  children?: React.ReactNode;
}
const Badge = ({ color, borderColor, bgColor, children }: BadgeProps) => {
  color = color ?? 'gray-500';
  return (
    <div
      className={`fixed bottom-[2vh] right-[2vw] w-[4vw] aspect-square flex items-center justify-center ${
        borderColor ? `border-2 border-${borderColor}` : ''
      } opacity-75 hover:opacity-100 border-${color} bg-${bgColor} text-${color} rounded-3xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 shadow-md shadow-slate-300`}
    >
      {children}
    </div>
  );
};

export default Badge;
