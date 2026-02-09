import { ProductIngredient, SafetyLevel } from "@prisma/client";


export interface IIngredient {
  id?: string;
  name: string;
  description?: string;
  benefits?: string;
  sideEffects?: string;
  usage?: string;
  precautions?: string;
  isActive?: boolean;
  safetyLevel: SafetyLevel;
  products?: ProductIngredient[];
  createdAt?: Date;
  updatedAt?: Date;
}
