
import React, { useState, useEffect, useCallback } from 'react';
import { DayMenu, MealSelection, MealType, MenuItem, DailySelection } from '../../types';
import { canteenService } from '../../services/canteenService';
import { notificationService } from '../../services/notificationService';
import { MEAL_TYPES, NOTIFICATION_TIMES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Button from '../ui/Button';
import NotificationBanner from '../ui/NotificationBanner';
import CheckIcon from '../icons/CheckIcon';
import XIcon from '../icons/XIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import Modal from '../ui/Modal';

declare const QRCode: any;

type DailyStep = 'location' | 'menu' | 'confirmed_wfh' | 'confirmed_onsite';

interface DailyScreenProps {
  navigateToDashboard: () => void;
}

const DailyScreen: React.FC<DailyScreenProps> = ({ navigateToDashboard }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<DailyStep>('location');
  const [menu, setMenu] = useState<DayMenu | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState<MealSelection>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const now = new Date();
  const isAfter9PM = now.getHours() >= 21;
  const isAfter10PM = now.getHours() >= 22;

  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  // FIX: Corrected typo from toLocaleDate to toLocaleDateString.
  const nextDayString = nextDay.toLocaleDateString('en-CA'); // YYYY-MM-DD format

  const storageKey = user ? `dailySelection_${user.id}_${nextDayString}` : '';

  useEffect(() => {
    if (!user || !storageKey) return;
    
    const savedSelectionStr = localStorage.getItem(storageKey);
    if (savedSelectionStr) {
      const savedSelection: DailySelection = JSON.parse(savedSelectionStr);
      if (savedSelection.date === nextDayString) {
        if (savedSelection.wfh) {
          setStep('confirmed_wfh');
        } else {
          setSelection(savedSelection.meals);
          setStep('confirmed_onsite');
        }
        return;
      }
    }

    const todayStr = new Date().toLocaleDateString('en-CA');
    const currentHour = new Date().getHours();

    NOTIFICATION_TIMES.forEach(notif => {
      const notifSentKey = `notif_sent_${notif.hour}_${todayStr}_${user.id}`;
      const alreadySent = localStorage.getItem(notifSentKey);

      if (currentHour >= notif.hour && !alreadySent) {
        notificationService.sendSms(user.phone, notif.message);
        localStorage.setItem(notifSentKey, 'true');
      }
    });

  }, [user, storageKey, nextDayString]);

  const fetchMenuAndSet = useCallback(async () => {
    if (!menu) {
      setIsLoading(true);
      const fetchedMenu = await canteenService.getDailyMenu(nextDay);
      setMenu(fetchedMenu);
      setIsLoading(false);
    }
  }, [nextDay, menu]);

  useEffect(() => {
    if (step === 'confirmed_onsite' && user) {
        fetchMenuAndSet(); // Ensure menu is available for display
        const qrData = JSON.stringify({
            userId: user.id,
            name: user.name,
            date: nextDayString,
            meals: selection
        });
        QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H', width: 256, margin: 2 }, (err: any, url: string) => {
            if (err) console.error("QR Code generation failed:", err);
            else setQrCodeDataUrl(url);
        });
    }
  }, [step, user, nextDayString, selection, fetchMenuAndSet]);

  const handleLocationSelect = (isWfh: boolean) => {
    if (isWfh) {
      const wfhSelection: DailySelection = { date: nextDayString, wfh: true, meals: {} };
      localStorage.setItem(storageKey, JSON.stringify(wfhSelection));
      setStep('confirmed_wfh');
    } else {
      fetchMenuAndSet();
      setStep('menu');
    }
  };

  const toggleMealSelection = (mealType: MealType, itemId: string) => {
    setSelection(prev => {
        const currentItems = prev[mealType] || [];
        const newItems = currentItems.includes(itemId)
            ? currentItems.filter(id => id !== itemId)
            : [...currentItems, itemId];
        return { ...prev, [mealType]: newItems };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const finalSelection: DailySelection = { date: nextDayString, wfh: false, meals: selection };
    await canteenService.submitDailySelection(finalSelection);
    localStorage.setItem(storageKey, JSON.stringify(finalSelection));
    setIsSubmitting(false);
    setStep('confirmed_onsite');
  };

  const handleConfirmCancel = async () => {
    if (!user) return;
    await canteenService.deleteDailySelection(user.id, nextDayString);
    localStorage.removeItem(storageKey);
    setSelection({});
    setStep('location');
    setIsDeleteModalOpen(false);
  };

  const MealCard: React.FC<{ mealType: MealType; items: MenuItem[] }> = ({ mealType, items }) => (
    <Card className="mb-6 transition-shadow duration-300 hover:shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-karmic-primary">{mealType}</h3>
      <div className="space-y-3">
        {items.map(item => (
            <div
                key={item.id}
                onClick={() => !isAfter10PM && toggleMealSelection(mealType, item.id)}
                className={`flex justify-between items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
                    selection[mealType]?.includes(item.id)
                        ? 'border-karmic-secondary bg-green-50 shadow-sm'
                        : 'border-gray-200 hover:border-karmic-primary hover:bg-blue-50'
                } ${isAfter10PM ? 'cursor-not-allowed opacity-60' : ''}`}
            >
                <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-karmic-subtext">{item.description}</p>
                </div>
                {selection[mealType]?.includes(item.id) && <CheckIcon className="text-karmic-secondary" />}
            </div>
        ))}
      </div>
    </Card>
  );

  const ConfirmationActions = () => (
    <div className="mt-6 bg-gray-50 p-4 rounded-b-xl border-t">
        <p className="text-sm text-center text-karmic-subtext mb-4">
            {isAfter10PM 
                ? "The 10 PM deadline has passed. Your selection is locked."
                : "You can modify or cancel this selection until 10 PM tonight."
            }
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={() => setStep('location')} disabled={isAfter10PM}>Edit Selection</Button>
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)} disabled={isAfter10PM}>Cancel Order</Button>
        </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading && !menu) return <Spinner />;

    switch(step) {
      case 'location':
        return (
          <Card>
            <h2 className="text-2xl font-bold text-center mb-6">Where are you working tomorrow?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="secondary" onClick={() => handleLocationSelect(false)}>On-site</Button>
              <Button variant="primary" onClick={() => handleLocationSelect(true)}>Work From Home</Button>
            </div>
          </Card>
        );
      case 'menu':
        return menu && (
          <div>
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Menu for Tomorrow ({nextDayString})</h2>
                {isAfter10PM && <NotificationBanner type="warning" message="The 10 PM modification deadline has passed. Selections are now locked." />}
            </div>
            {MEAL_TYPES.map(mealType => <MealCard key={mealType} mealType={mealType} items={menu[mealType] as MenuItem[]} />)}
            <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={isAfter10PM}>
                Confirm My Selection
            </Button>
          </div>
        );
      case 'confirmed_wfh':
        return (
            <Card className="text-center p-0 overflow-hidden">
                <div className="p-8">
                    <CheckIcon className="text-karmic-secondary mx-auto h-16 w-16" />
                    <h2 className="text-2xl font-bold mt-4">All Set!</h2>
                    <p className="text-karmic-subtext mt-2">We've noted you'll be working from home tomorrow. Have a productive day!</p>
                </div>
                <ConfirmationActions />
            </Card>
        );
      case 'confirmed_onsite':
        return (
            <Card className="text-center bg-gradient-to-br from-karmic-primary to-blue-800 text-white p-0 overflow-hidden shadow-2xl">
              <div className="p-8">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white text-karmic-secondary mb-4 shadow-lg">
                      <CheckIcon className="h-10 w-10" />
                  </div>
                  <h2 className="text-3xl font-bold mt-4">Your Meal Pass is Ready!</h2>
                  <p className="text-blue-200 mt-2">Show this QR code at the canteen counter for <span className="font-bold">{nextDayString}</span>.</p>
              </div>
              
              <div className="bg-white p-6 m-4 sm:m-8 rounded-xl shadow-inner">
                  {qrCodeDataUrl ? <img src={qrCodeDataUrl} alt="Your Meal QR Code" className="mx-auto rounded-lg" /> : <Spinner />}
              </div>

              <div className="bg-blue-900 bg-opacity-50 p-6 text-left">
                  <h4 className="font-bold mb-3 text-lg">Your Selections:</h4>
                  {Object.values(selection).some(v => v?.length) ? Object.entries(selection).map(([mealType, itemIds]) =>
                     (itemIds?.length > 0) && (
                          <div key={mealType} className="mb-2">
                              <p className="font-semibold text-blue-200">{mealType}:</p>
                              <ul className="list-disc list-inside text-white pl-2">
                                  {itemIds.map(id => <li key={id}>{menu?.[mealType as MealType]?.find(i => i.id === id)?.name}</li>)}
                              </ul>
                          </div>
                      )
                  ) : <p className="text-blue-200">No meals selected for this day.</p>}
              </div>
              <ConfirmationActions />
          </Card>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
        <button 
          onClick={navigateToDashboard} 
          className="flex items-center space-x-2 text-karmic-subtext hover:text-karmic-primary font-semibold mb-6 transition-colors duration-200"
        >
          <ArrowLeftIcon />
          <span>Back to Dashboard</span>
        </button>
        {renderContent()}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Cancellation">
            <p>Are you sure you want to cancel your meal order for tomorrow? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end space-x-3">
                <Button variant='outline' className="w-auto" onClick={() => setIsDeleteModalOpen(false)}>Back</Button>
                <Button variant="danger" className="w-auto" onClick={handleConfirmCancel}>Yes, Cancel Order</Button>
            </div>
        </Modal>
    </div>
  );
};

export default DailyScreen;