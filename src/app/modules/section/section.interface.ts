import { SECTION_TYPE } from "../../../generated/prisma";

export interface ISection {
  type?: SECTION_TYPE;
  title?: string | null;
  description?: string | null;
  images: string[];
  icons?: string | null;
  link?: string | null;
  ctaText?: string | null;
  isVisible?: boolean | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
