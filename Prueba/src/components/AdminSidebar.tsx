
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
} from 'lucide-react';

export const AdminSidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Package, label: 'Productos' },
    { icon: ShoppingCart, label: 'Pedidos' },
    { icon: Users, label: 'Clientes' },
    { icon: BarChart3, label: 'Reportes' },
    { icon: Settings, label: 'Configuración' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary-600">
            <img
              src="/logo.jpeg"
              alt="Logo Mambo Petshop"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mambo</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant={item.active ? "default" : "ghost"}
            className={`w-full justify-start ${
              item.active 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
          <LogOut className="h-4 w-4 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};
