export interface Meal {
  lunch: string;
  description2: string;
  proteins?: number;
  carbohydrates?: number;
  fats?: number;
  calories?: number;
  img_url?: string;
}

export interface Diet {
  id: string;
  userId: string;
  title: string;
  description1: string;
  meals: Meal[];
}
