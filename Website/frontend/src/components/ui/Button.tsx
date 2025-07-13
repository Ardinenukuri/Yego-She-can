// src/components/ui/Button.tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;