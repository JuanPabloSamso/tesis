import React from 'react';

export const Icons = {
  ShoppingCart: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  User: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09L15 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L11.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L18.25 7.5l-.813-2.846a4.5 4.5 0 00-3.09-3.09L15 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L21.75 12l-2.846.813a4.5 4.5 0 003.09 3.09L18.25 19.5l-.813-2.846a4.5 4.5 0 00-3.09-3.09L11.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L18.25 7.5z" />
    </svg>
  ),
  Trash: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.096 3.25.27m-5.036 0c-.709.184-1.345.399-1.897.641M5.25 6H9m6 H18.75" />
    </svg>
  ),
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const APP_COLORS = {
  // Primary and CTA
  primaryBlue: 'bg-[#2563EB]',
  textPrimaryBlue: 'text-[#2563EB]',
  primaryBlueLight: 'bg-[#EFF6FF]',
  primaryBlueDark: 'bg-[#1D4ED8]',
  ctaOrange: 'bg-[#F97316]',
  textCtaOrange: 'text-[#F97316]',
  ctaOrangeHover: 'bg-[#EA580C]',
  ctaOrangeLight: 'bg-[#FFF7ED]',

  // Accent
  accentGreen: 'bg-[#10B981]',
  textAccentGreen: 'text-[#10B981]',
  accentGreenHover: 'bg-[#059669]',
  accentGreenLight: 'bg-[#ECFDF5]',

  // Neutrals
  neutralWhite: 'bg-[#FFFFFF]',
  neutralBg: 'bg-[#F9FAFB]',
  neutral100: 'bg-[#F3F4F6]',
  neutral200: 'bg-[#E5E7EB]',
  neutral300: 'bg-[#D1D5DB]',
  neutral500: 'text-[#6B7280]',
  neutral700: 'text-[#374151]',
  neutral800: 'text-[#1F2937]',
  neutral900: 'text-[#11182C]',
  borderNeutral100: 'border-[#F3F4F6]',
  borderNeutral200: 'border-[#E5E7EB]',
  borderNeutral300: 'border-[#D1D5DB]',

  // Action
  actionRed: 'bg-[#EF4444]',
  textActionRed: 'text-[#EF4444]',
  actionRedHover: 'bg-[#DC2626]',
  actionRedLight: 'bg-[#FEF2F2]',

  // Semantic (for specific meanings)
  semanticPopularBg: 'bg-[#FFFBEB]',
  semanticPopularText: 'text-[#B45309]',
  semanticPopularBorder: 'border-[#FDE68A]',
  semanticSpotlightBg: 'bg-[#F3E8FF]',
  semanticSpotlightText: 'text-[#7E22CE]',
  semanticSpotlightBorder: 'border-[#D8B4FE]',
  semanticFreshBg: 'bg-[#F0FDF4]',
  semanticFreshText: 'text-[#15803D]',
  semanticFreshBorder: 'border-[#A7F3D0]',
  semanticOfferBg: 'bg-[#FEF2F2]',
  semanticOfferText: 'text-[#B91C1C]',
};
