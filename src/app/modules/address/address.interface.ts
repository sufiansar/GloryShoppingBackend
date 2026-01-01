export interface IAddress {
  userId: string;
  label?: string | null;
  name: string;
  street: string;
  city: string;
  district: string;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
}
