import React from 'react';

interface CardProps {
  children: React.ReactNode;
  interactive?: boolean;
  // FIX: Updated onClick prop type to correctly handle mouse events.
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, interactive = false, onClick, className = '' }) => {
  const baseClasses = 'bg-amber-100/70 backdrop-blur-sm border-2 border-amber-200 rounded-lg p-6 shadow-lg';
  const interactiveClasses = interactive ? 'cursor-pointer hover:shadow-xl hover:border-amber-300 transition-all duration-300' : '';
  
  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
