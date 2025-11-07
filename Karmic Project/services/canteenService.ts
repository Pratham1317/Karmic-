import { DayMenu, MealType, MenuItem } from '../types';

// Expanded mock items for more variety
const mockBreakfastItems: MenuItem[] = [
  { id: 'b1', name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup.' },
  { id: 'b2', name: 'Poha', description: 'Flattened rice with onions and spices.' },
  { id: 'b3', name: 'Upma', description: 'Thick porridge from dry-roasted semolina.' },
  { id: 'b4', name: 'Masala Dosa', description: 'Crispy rice pancake with potato filling.' },
  { id: 'b5', name: 'Aloo Paratha', description: 'Whole wheat flatbread with spiced potato.' },
  { id: 'b6', name: 'Chole Bhature', description: 'Spicy chickpeas with fluffy fried bread.' },
  { id: 'b7', name: 'Oats Porridge', description: 'Healthy and simple oats porridge.' },
];

const mockLunchItems: MenuItem[] = [
  { id: 'l1', name: 'Veg Thali', description: 'Roti, Rice, Dal, 2 Veg Curries, Salad.' },
  { id: 'l2', name: 'Paneer Butter Masala', description: 'Rich and creamy curry of paneer.' },
  { id: 'l3', name: 'Rajma Chawal', description: 'Red kidney beans in a thick gravy with rice.' },
  { id: 'l4', name: 'Kadai Paneer & Naan', description: 'Spicy paneer dish with Indian bread.' },
  { id: 'l5', name: 'Dal Makhani Combo', description: 'Creamy black lentils with rice and roti.' },
  { id: 'l6', name: 'Veg Pulao with Raita', description: 'Aromatic rice with vegetables and yogurt.' },
  { id: 'l7', name: 'South Indian Thali', description: 'Sambar, Rasam, Rice, Poriyal, Appalam.' },
];

const mockSnacksItems: MenuItem[] = [
  { id: 's1', name: 'Samosa Chaat', description: 'Crispy samosa with yogurt and chutneys.' },
  { id: 's2', name: 'Vada Pav', description: 'Deep fried potato dumpling in a bread bun.' },
  { id: 's3', name: 'Fruit Salad', description: 'A mix of seasonal fresh fruits.' },
  { id: 's4', name: 'Dhokla', description: 'Steamed savory cake from fermented batter.' },
  { id: 's5', name: 'Bhel Puri', description: 'Puffed rice with vegetables and tamarind sauce.' },
  { id: 's6', name: 'Paneer Tikka', description: 'Marinated and grilled paneer cubes.' },
  { id: 's7', name: 'Vegetable Cutlet', description: 'Spiced vegetable patties, shallow fried.' },
];

const mockDinnerItems: MenuItem[] = [
    { id: 'd1', name: 'Dal Makhani & Naan', description: 'Creamy black lentils with butter naan.' },
    { id: 'd2', name: 'Veg Biryani', description: 'Aromatic rice dish with mixed vegetables.' },
    { id: 'd3', name: 'Jeera Rice & Dal Fry', description: 'Cumin flavored rice with fried lentils.' },
    { id: 'd4', name: 'Mushroom Masala & Roti', description: 'Spicy mushroom gravy with flatbread.' },
    { id: 'd5', name: 'Veg Korma & Paratha', description: 'Mixed vegetables in a creamy sauce.' },
    { id: 'd6', name: 'Gobi Manchurian with Fried Rice', description: 'Indo-Chinese cauliflower dish.' },
    { id: 'd7', name: 'Palak Paneer with Jeera Rice', description: 'Spinach and cottage cheese curry with rice.' },
];


const getFixedMenuForDay = (date: Date): DayMenu => {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const dailyMenus: { [key: number]: Omit<DayMenu, 'date'> } = {
        1: { // Monday
            [MealType.BREAKFAST]: [mockBreakfastItems[0], mockBreakfastItems[1]],
            [MealType.LUNCH]: [mockLunchItems[0], mockLunchItems[1]],
            [MealType.SNACKS]: [mockSnacksItems[0], mockSnacksItems[1]],
            [MealType.DINNER]: [mockDinnerItems[0], mockDinnerItems[1]],
        },
        2: { // Tuesday
            [MealType.BREAKFAST]: [mockBreakfastItems[2], mockBreakfastItems[3]],
            [MealType.LUNCH]: [mockLunchItems[2], mockLunchItems[3]],
            [MealType.SNACKS]: [mockSnacksItems[2], mockSnacksItems[3]],
            [MealType.DINNER]: [mockDinnerItems[2], mockDinnerItems[3]],
        },
        3: { // Wednesday
            [MealType.BREAKFAST]: [mockBreakfastItems[4], mockBreakfastItems[5]],
            [MealType.LUNCH]: [mockLunchItems[4], mockLunchItems[5]],
            [MealType.SNACKS]: [mockSnacksItems[4], mockSnacksItems[5]],
            [MealType.DINNER]: [mockDinnerItems[4], mockDinnerItems[5]],
        },
        4: { // Thursday
            [MealType.BREAKFAST]: [mockBreakfastItems[6], mockBreakfastItems[0]],
            [MealType.LUNCH]: [mockLunchItems[6], mockLunchItems[0]],
            [MealType.SNACKS]: [mockSnacksItems[6], mockSnacksItems[0]],
            [MealType.DINNER]: [mockDinnerItems[6], mockDinnerItems[0]],
        },
        5: { // Friday
            [MealType.BREAKFAST]: [mockBreakfastItems[1], mockBreakfastItems[2]],
            [MealType.LUNCH]: [mockLunchItems[1], mockLunchItems[2]],
            [MealType.SNACKS]: [mockSnacksItems[1], mockSnacksItems[2]],
            [MealType.DINNER]: [mockDinnerItems[1], mockDinnerItems[2]],
        },
        6: { // Saturday
            [MealType.BREAKFAST]: [mockBreakfastItems[3], mockBreakfastItems[4]],
            [MealType.LUNCH]: [mockLunchItems[3], mockLunchItems[4]],
            [MealType.SNACKS]: [mockSnacksItems[3], mockSnacksItems[4]],
            [MealType.DINNER]: [mockDinnerItems[3], mockDinnerItems[4]],
        },
        0: { // Sunday
            [MealType.BREAKFAST]: [mockBreakfastItems[5], mockBreakfastItems[6]],
            [MealType.LUNCH]: [mockLunchItems[5], mockLunchItems[6]],
            [MealType.SNACKS]: [mockSnacksItems[5], mockSnacksItems[6]],
            [MealType.DINNER]: [mockDinnerItems[5], mockDinnerItems[6]],
        },
    };

    const menu = dailyMenus[day] || dailyMenus[1]; // Fallback to Monday

    return {
        date: date.toISOString().split('T')[0],
        ...menu,
    };
};

export const canteenService = {
  getDailyMenu: (date: Date): Promise<DayMenu> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getFixedMenuForDay(date));
      }, 500);
    });
  },
  getWeeklyMenu: (startDate: Date): Promise<DayMenu[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const weekMenu: DayMenu[] = [];
            for (let i = 0; i < 7; i++) {
                const day = new Date(startDate);
                day.setDate(startDate.getDate() + i);
                weekMenu.push(getFixedMenuForDay(day));
            }
            resolve(weekMenu);
        }, 800);
    });
  },
  submitDailySelection: (selection: any): Promise<{ success: true }> => {
    console.log('Submitting/Updating Daily Selection:', selection);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 700);
    });
  },
  submitWeeklySelection: (selection: any): Promise<{ success: true }> => {
    console.log('Submitting/Updating Weekly Selection:', selection);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
  },
  deleteDailySelection: (userId: string, date: string): Promise<{ success: true }> => {
    console.log(`Deleting Daily Selection for user ${userId} on ${date}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true });
        }, 400);
    });
  },
  deleteWeeklySelection: (userId: string): Promise<{ success: true }> => {
    console.log(`Deleting Weekly Selection for user ${userId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true });
        }, 400);
    });
  }
};