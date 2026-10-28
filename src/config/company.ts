/**
 * Central Company Identity & Business Details for CLARVO
 * Single source of truth across website footers, legal pages, consultation requests, and contact sections.
 */

export interface OfficeAddress {
  label: string;
  isHeadOffice?: boolean;
  addressLines: string[];
  city: string;
  state: string;
  pincode: string;
  country: string;
  fullAddress: string;
}

export interface CompanyConfig {
  brandName: string;
  legalName: string;
  cin: string;
  tagline: string;
  email: string;
  phone: string;
  phoneFormatted: string;
  telLink: string;
  mailtoLink: string;
  headOffice: OfficeAddress;
  kolkataBranch: OfficeAddress;
  copyright: string;
}

export const COMPANY_CONFIG: CompanyConfig = {
  brandName: 'CLARVO',
  legalName: 'CLARVO EDUCATION PRIVATE LIMITED',
  cin: 'U85500WB2026PTC289958',
  tagline: 'Clarity for Their Future.',
  email: 'support@clarvo.in',
  phone: '+918828016354',
  phoneFormatted: '+91 88280 16354',
  telLink: 'tel:+918828016354',
  mailtoLink: 'mailto:support@clarvo.in',

  // Head Office: Juhu, Mumbai (Provided by business owner)
  headOffice: {
    label: 'Head Office (Mumbai)',
    isHeadOffice: true,
    addressLines: [
      'ISKCON Temple Entrance Rd',
      'Chand Society, Vithal Nagar',
      'Juhu, Mumbai',
    ],
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400049',
    country: 'India',
    fullAddress: 'ISKCON Temple Entrance Rd, Chand Society, Vithal Nagar, Juhu, Mumbai, Maharashtra 400049, India',
  },

  // Kolkata Branch (Provided by business owner)
  kolkataBranch: {
    label: 'Kolkata Branch',
    isHeadOffice: false,
    addressLines: [
      'Shiivani Complex, 47/C, BL-3, FL-A3',
      'Pottery Road',
      'Kolkata – 700015',
    ],
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700015',
    country: 'India',
    fullAddress: 'Shiivani Complex, 47/C, BL-3, FL-A3, Pottery Road, Kolkata – 700015, West Bengal, India',
  },

  copyright: `© ${new Date().getFullYear()} CLARVO EDUCATION PRIVATE LIMITED. All rights reserved.`,
};
