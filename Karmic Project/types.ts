export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface MenuItem {
  id: string;
  name:string;
  description: string;
}

export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  SNACKS = 'Snacks',
  DINNER = 'Dinner'
}

export interface DayMenu {
  date: string; // YYYY-MM-DD
  [MealType.BREAKFAST]: MenuItem[];
  [MealType.LUNCH]: MenuItem[];
  [MealType.SNACKS]: MenuItem[];
  [MealType.DINNER]: MenuItem[];
}

export type MealSelection = {
  [key in MealType]?: string[]; // Array of MenuItem ids
};

export type DailySelection = {
  date: string;
  wfh: boolean;
  meals: MealSelection;
};

export type WeeklySelection = {
  [date: string]: DailySelection;
};