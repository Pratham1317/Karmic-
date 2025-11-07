import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full flex justify-center items-center font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed border';

  const variantClasses = {
    primary: 'bg-karmic-primary text-white border-transparent hover:bg-blue-800 focus:ring-karmic-primary',
    secondary: 'bg-karmic-secondary text-white border-transparent hover:bg-green-600 focus:ring-karmic-secondary',
    danger: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-600',
    outline: 'bg-transparent border-karmic-primary text-karmic-primary hover:bg-karmic-primary hover:text-white focus:ring-karmic-primary',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;