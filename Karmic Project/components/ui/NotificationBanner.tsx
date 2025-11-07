
import React from 'react';

interface NotificationBannerProps {
  message: string;
  type?: 'info' | 'warning' | 'success';
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, type = 'info' }) => {
  const bgColors = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    success: 'bg-green-100 border-green-500 text-green-700',
  };

  return (
    <div className={`border-l-4 p-4 ${bgColors[type]}`} role="alert">
      <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
      <p>{message}</p>
    </div>
  );
};

export default NotificationBanner;
