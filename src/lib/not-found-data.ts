import type { LucideIcon } from 'lucide-react';
import {
  Info,
  BookOpen,
  Wrench,
  Settings2,
  Mail,
} from 'lucide-react';

export interface QuickLink {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

/**
 * "Popular destinations" — the pages people who land on a 404
 * are statistically most likely to actually want.
 */
export const quickLinks: QuickLink[] = [
  {
    label: 'About',
    description: 'What MailMyCertificate does and why it exists.',
    href: '/about',
    icon: Info,
  },
  {
    label: 'Guide',
    description: 'Step-by-step docs for sending certificates in bulk.',
    href: '/guide',
    icon: BookOpen,
  },
  {
    label: 'Open Tool',
    description: 'Jump straight back into the certificate sender.',
    href: '/tool',
    icon: Wrench,
  },
  {
    label: 'Settings',
    description: 'Manage your sender details and preferences.',
    href: '/settings',
    icon: Settings2,
  },
  {
    label: 'Contact',
    description: 'Stuck on something specific? We read every message.',
    href: '/contact',
    icon: Mail,
  },
];

export interface ExternalProject {
  name: string;
  url: string;
  description: string;
  /** Short initials shown in the logo placeholder */
  initials: string;
}

/**
 * Other projects worth a visit while you're here.
 */
export const otherProjects: ExternalProject[] = [
  {
    name: 'SafeExam',
    url: 'https://safexam.in',
    description: 'Secure online examination platform.',
    initials: 'SE',
  },
  {
    name: 'Calcuzy',
    url: 'https://calcuzy.app',
    description: 'Modern calculation toolkit.',
    initials: 'CZ',
  },
  {
    name: 'Priya Sarv Utthan',
    url: 'https://priyasarvutthan.org',
    description: 'NGO making social impact.',
    initials: 'PS',
  },
];