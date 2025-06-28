import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  UserCircle,
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const AdminSidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Package, label: 'Productos' },
    { icon: ShoppingCart, label: 'Pedidos' },
    { icon: Users, label: 'Usuarios' },
    { icon: BarChart3, label: 'Reportes' },
    { icon: FileText, label: 'Blog' },
    { icon: MessageSquare, label: 'Quejas y Sugerencias' },
    { icon: Settings, label: 'Configuración' },
    { icon: UserCircle, label: 'Perfil' },
  ];

  return (
    <div className="relative w-16 sm:w-64 bg-white shadow-lg border-r flex flex-col h-screen">
      <div className="p-2 sm:p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary-600">
            <img
              src="/logo.jpeg"
              alt="Logo Mambo Petshop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="sm:inline hidden">
            <h2 className="text-xl font-bold text-gray-900">Mambo</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="p-2 sm:p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            onClick={() => setActiveSection(item.label)}
            variant={item.label === activeSection ? 'default' : 'ghost'}
            className={`w-12 sm:w-full justify-start flex sm:items-center items-center space-x-2 ${
              item.label === activeSection
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="sm:inline hidden">{item.label}</span> {/* Texto solo visible en pantallas grandes */}
          </Button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 sm:hidden flex justify-center">
        <Button variant="ghost" className="w-12 sm:w-12 justify-start text-gray-700 hover:bg-gray-100">
          <LogOut className="h-6 w-6 mr-3" />
        </Button>
      </div>
    </div>
  );
};
