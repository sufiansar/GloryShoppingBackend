import { SECTION_TYPE } from "@prisma/client";

export interface ISection {
  type?: SECTION_TYPE;
  title?: string | null;
  description?: string | null;
  images: string[];
  icons?: string | null;
  link?: string | null;
  ctaText?: string | null;
  isVisible: boolean | string | null | undefined;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}
