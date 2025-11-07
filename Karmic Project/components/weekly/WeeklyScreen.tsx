import React, { useState, useEffect, useCallback } from 'react';
import { DayMenu, WeeklySelection, MealType, MenuItem } from '../../types';
import { canteenService } from '../../services/canteenService';
import { MEAL_TYPES, DAYS_OF_WEEK, WEEKEND_NOTIFICATION_MESSAGE } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Button from '../ui/Button';
import NotificationBanner from '../ui/NotificationBanner';
import Modal from '../ui/Modal';
import CheckIcon from '../icons/CheckIcon';
import XIcon from '../icons/XIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

interface WeeklyScreenProps {
  navigateToDashboard: () => void;
}

const WeeklyScreen: React.FC<WeeklyScreenProps> = ({ navigateToDashboard }) => {
    const { user } = useAuth();
    const [menus, setMenus] = useState<DayMenu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selections, setSelections] = useState<WeeklySelection>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const today = new Date();
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;

    const getNextMonday = () => {
        const date = new Date();
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };
    
    const fetchWeeklyMenu = useCallback(async () => {
        const nextMonday = getNextMonday();
        const fetchedMenus = await canteenService.getWeeklyMenu(nextMonday);
        setMenus(fetchedMenus);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchWeeklyMenu();
    }, [fetchWeeklyMenu]);

    const handleLocationSelect = (date: string, isWfh: boolean) => {
        setSelections(prev => ({
            ...prev,
            [date]: { date, wfh: isWfh, meals: isWfh ? {} : prev[date]?.meals || {} },
        }));
    };

    const toggleMealSelection = (date: string, mealType: MealType, itemId: string) => {
        setSelections(prev => {
            const daySelection = prev[date] || { date, wfh: false, meals: {} };
            const mealItems = daySelection.meals[mealType] || [];
            const newMealItems = mealItems.includes(itemId)
                ? mealItems.filter(id => id !== itemId)
                : [...mealItems, itemId];
            
            return {
                ...prev,
                [date]: {
                    ...daySelection,
                    meals: { ...daySelection.meals, [mealType]: newMealItems },
                },
            };
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await canteenService.submitWeeklySelection(selections);
        setIsSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
    };

    const handleDeleteWeek = async () => {
        if(!user) return;
        await canteenService.deleteWeeklySelection(user.id);
        setSelections({});
        setIsDeleteModalOpen(false);
    };

    if (isLoading) return <Spinner />;
    
    const activeDayMenu = menus[activeDayIndex];
    if (!activeDayMenu) return <p>No menu available.</p>;

    const activeDaySelection = selections[activeDayMenu.date];

    return (
        <div className="max-w-5xl mx-auto">
            <button 
                onClick={navigateToDashboard} 
                className="flex items-center space-x-2 text-karmic-subtext hover:text-karmic-primary font-semibold mb-6 transition-colors duration-200"
            >
                <ArrowLeftIcon />
                <span>Back to Dashboard</span>
            </button>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Plan Your Meals for the Week</h2>
                <p className="text-lg text-karmic-subtext mt-2">Starting {menus[0]?.date}</p>
                 {isWeekend && !showSuccess && <NotificationBanner type="info" message={WEEKEND_NOTIFICATION_MESSAGE} />}
                 {showSuccess && <NotificationBanner type="success" message="Your weekly meal plan has been successfully saved!" />}
            </div>

            {/* Day Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-4 mb-6">
                {menus.map((day, index) => {
                     const date = new Date(day.date + 'T00:00:00');
                     const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
                     return (
                        <button 
                            key={day.date} 
                            onClick={() => setActiveDayIndex(index)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${activeDayIndex === index ? 'bg-karmic-primary text-white shadow-md' : 'bg-white text-karmic-text hover:bg-gray-100'}`}
                        >
                            {dayOfWeek} ({day.date.slice(5)})
                        </button>
                    )}
                )}
            </div>

            <Card>
                <h3 className="text-2xl font-bold mb-4">{new Date(activeDayMenu.date + 'T00:00:00').toDateString()}</h3>
                
                {/* WFH/On-site toggle */}
                <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold">Work Location:</p>
                    <button onClick={() => handleLocationSelect(activeDayMenu.date, false)} className={`px-4 py-2 rounded-md transition ${!activeDaySelection?.wfh ? 'bg-karmic-secondary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>On-site</button>
                    <button onClick={() => handleLocationSelect(activeDayMenu.date, true)} className={`px-4 py-2 rounded-md transition ${activeDaySelection?.wfh ? 'bg-karmic-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Work from Home</button>
                </div>

                {/* Menu */}
                {!activeDaySelection?.wfh ? (
                     <div className="grid md:grid-cols-2 gap-6">
                        {MEAL_TYPES.map(mealType => (
                            <div key={mealType} className="border p-4 rounded-lg">
                                <h4 className="font-bold text-lg mb-3 text-karmic-primary">{mealType}</h4>
                                <div className="space-y-2">
                                    {activeDayMenu[mealType].map(item => (
                                        <div key={item.id} onClick={() => toggleMealSelection(activeDayMenu.date, mealType, item.id)} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${activeDaySelection?.meals[mealType]?.includes(item.id) ? 'bg-green-50' : 'hover:bg-gray-100'}`}>
                                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${activeDaySelection?.meals[mealType]?.includes(item.id) ? 'bg-karmic-secondary border-karmic-secondary' : 'border-gray-300'}`}>
                                               {activeDaySelection?.meals[mealType]?.includes(item.id) && <CheckIcon className="text-white h-4 w-4" />}
                                            </div>
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-blue-50 rounded-lg">
                        <p className="text-karmic-subtext">You've selected Work from Home for this day. No meals needed.</p>
                    </div>
                )}
            </Card>

            <div className="mt-8 flex flex-col md:flex-row gap-4">
                <Button onClick={handleSubmit} isLoading={isSubmitting}>Save / Update Selections</Button>
                <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Entire Week's Schedule</Button>
            </div>
            
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p>Are you sure you want to delete the entire week's meal schedule? This action cannot be undone.</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <Button variant="danger" onClick={handleDeleteWeek} className="w-auto">Yes, Delete</Button>
                </div>
            </Modal>
        </div>
    );
};

export default WeeklyScreen;