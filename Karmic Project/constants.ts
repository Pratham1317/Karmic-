import { MealType } from './types';

export const MEAL_TYPES: MealType[] = [
  MealType.BREAKFAST,
  MealType.LUNCH,
  MealType.SNACKS,
  MealType.DINNER,
];

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const NOTIFICATION_TIMES = [
    { time: 'Morning (9 AM)', hour: 9, message: "Don't forget to set your meal preferences for tomorrow before 9 PM!" },
    { time: 'Afternoon (2 PM)', hour: 14, message: "Just a friendly reminder to confirm your meals for tomorrow." },
    { time: 'Evening (8 PM)', hour: 20, message: "Last call! Please submit your meal choices for tomorrow in the next hour." },
];

export const WEEKEND_NOTIFICATION_MESSAGE = "Time to plan your meals for the upcoming week! Please submit your choices.";