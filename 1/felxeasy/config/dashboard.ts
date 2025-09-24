import {
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
  Inbox,
  FileText,
  Bot // ✅ Icono de Robot agregado
} from 'lucide-react';

export interface NavItem {
  href: string;
  icon: keyof typeof iconComponents;
  label: string;
  disabled?: boolean;
}

export const iconComponents = {
  Inbox,
  ShoppingCart,
  FileText,
  Package,
  Users2,
  LineChart,
  Bot // ✅ Icono agregado a los componentes
};

export const navConfig = [
  { href: '/dashboard', icon: 'Inbox', label: 'Dashboard' },
  { href: '/dashboard/robot', icon: 'Bot', label: 'Robot Control' }, // ✅ Nueva opción
  // { href: '/dashboard/posts', icon: 'FileText', label: 'Posts' },
  {
    href: '/dashboard/customer',
    icon: 'Users2',
    label: 'Customers',
    disabled: true
  },
  {
    href: '/dashboard/analytics',
    icon: 'LineChart',
    label: 'Analytics',
    disabled: true
  }
];