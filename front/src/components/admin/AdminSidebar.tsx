import {
  LayoutDashboard,
  Package,
  FolderKanban,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  UserCircle,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const AdminSidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Package, label: 'Productos' },
    { icon: FolderKanban, label: 'Categorías' },
    { icon: ShoppingCart, label: 'Pedidos' },
    { icon: Users, label: 'Usuarios' },
    { icon: BarChart3, label: 'Reportes' },
    { icon: FileText, label: 'Blog' },
    { icon: FileText, label: 'Listado Blog' }, // <-- NUEVO
    { icon: MessageSquare, label: 'Quejas y Sugerencias' },
    { icon: Settings, label: 'Configuración' },
    { icon: UserCircle, label: 'Perfil' },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Si cierras sesión, perderás tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'No, mantenerme aquí',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/';
      }
    });
  };

  return (
    <div className="w-20 sm:w-64 h-screen bg-white shadow-lg border-r flex flex-col">
      {/* Header con logo */}
      <div className="p-4 border-b flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-600">
          <img
            src="/logo.jpeg"
            alt="Logo Mambo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden sm:block">
          <h2 className="text-lg font-bold">Mambo</h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
      </div>

      {/* Menú */}
      <div className="flex-1 p-2 space-y-1">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            onClick={() => setActiveSection(item.label)}
            variant={item.label === activeSection ? 'default' : 'ghost'}
            className={`w-full flex items-center justify-start space-x-2 ${
              item.label === activeSection
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        ))}
      </div>

      {/* Botón de Cerrar Sesión anclado abajo */}
      <div className="p-4 mt-auto">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full flex items-center justify-start space-x-2 text-gray-700 hover:bg-red-500 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
};
