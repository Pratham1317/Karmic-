import React from 'react';
import Card from '../ui/Card';
import CalendarIcon from '../icons/CalendarIcon';
import ClockIcon from '../icons/ClockIcon';

interface DashboardScreenProps {
  navigateTo: (screen: 'daily' | 'weekly') => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigateTo }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-karmic-text">Welcome to Your Canteen Portal</h2>
        <p className="mt-3 text-lg text-karmic-subtext">How would you like to plan your meals?</p>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <DashboardCard
          icon={<ClockIcon />}
          title="Daily Planning"
          description="Confirm your meals for the next day. Quick and easy."
          onClick={() => navigateTo('daily')}
        />
        <DashboardCard
          icon={<CalendarIcon />}
          title="Weekly Planning"
          description="Plan your meals for the entire upcoming week."
          onClick={() => navigateTo('weekly')}
        />
      </div>
    </div>
  );
};

interface DashboardCardProps {
    // FIX: Changed icon type from React.ReactNode to a more specific React.ReactElement that accepts className to fix the type error with cloneElement.
    icon: React.ReactElement<{ className?: string }>;
    title: string;
    description: string;
    onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, description, onClick }) => {
    return (
        <div 
            onClick={onClick} 
            className="group bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 ease-in-out border-2 border-transparent hover:border-karmic-primary"
        >
            <div className="mx-auto bg-karmic-primary text-white rounded-full h-24 w-24 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-700 shadow-lg">
                {/* FIX: Removed unnecessary type assertion after updating prop type, resolving the overload error. */}
                {React.cloneElement(icon, { className: "h-12 w-12" })}
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-karmic-text">{title}</h3>
            <p className="mt-2 text-karmic-subtext">{description}</p>
            <div className="mt-6">
                <span className="inline-block text-karmic-primary font-semibold transition-transform duration-300 group-hover:translate-x-1">
                    Proceed &rarr;
                </span>
            </div>
        </div>
    );
};

export default DashboardScreen;