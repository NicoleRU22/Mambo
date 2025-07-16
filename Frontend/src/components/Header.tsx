import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, ShoppingCart, Home, Book, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cartService } from '@/services/api';
import { getLocalCart } from '@/utils/cartLocal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const loadCartCount = async () => {
      if (isAuthenticated) {
        try {
          const cartData = await cartService.getCart();
          setCartItemCount(cartData.summary?.itemCount || 0);
        } catch (error) {
          setCartItemCount(0);
        }
      } else {
        const localCart = getLocalCart();
        setCartItemCount(localCart.reduce((sum, item) => sum + item.quantity, 0));
      }
    };
    loadCartCount();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'guest_cart') loadCartCount();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="bg-primary-600 text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          ¡Envío gratis en compras superiores a S/.50! 🐾
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-18 h-14">
              <img src="https://i.pinimg.com/736x/d1/10/9e/d1109ea7a5b865ea67891b6cab2fc4a2.jpg" alt="Logo Mambo Petshop" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search onClick={handleSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" />
              <Input
                type="text"
                placeholder="Buscar ropa para tu mascota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1">
                    <User className="h-5 w-5" />
                    <span className="hidden lg:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Panel de Administración
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Mis Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1" onClick={() => navigate('/login')}>
                <User className="h-5 w-5" />
                <span className="hidden lg:inline">Mi Cuenta</span>
              </Button>
            )}

            <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-current block h-0.5 w-6 rounded-sm transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-current block h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-current block h-0.5 w-6 rounded-sm transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search onClick={handleSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" />
            <Input
              type="text"
              placeholder="Buscar ropa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex mt-4 space-x-8">
          <a href="#" onClick={() => navigate('/')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 flex items-center space-x-1">
            <Home className="h-4 w-4" />
            <span>Inicio</span>
          </a>
          <a href="#" onClick={() => navigate('/catalog')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">Catálogo</a>
          <a href="#" onClick={() => navigate('/ofertas')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">Ofertas</a>
          <a href="#" onClick={() => navigate('/aboutus')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">Nosotros</a>
          <a href="#" onClick={() => navigate('/contact')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">Contáctanos</a>
          <a href="#" onClick={() => navigate('/blog')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 flex items-center space-x-1">
            <Book className="h-4 w-4" />
            <span>Blog</span>
          </a>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <a href="#" onClick={() => navigate('/')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Inicio</a>
              <a href="#" onClick={() => navigate('/catalog')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Catálogo</a>
              <a href="#" onClick={() => navigate('/aboutus')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Nosotros</a>
              <a href="#" onClick={() => navigate('/contact')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Contáctanos</a>
              <a href="#" onClick={() => navigate('/blog')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Blog</a>
              <div className="pt-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    {user?.role === 'ADMIN' && (
                      <a href="#" onClick={() => navigate('/admin')} className="text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Panel de Administración</span>
                      </a>
                    )}
                    <a href="#" onClick={() => navigate('/profile')} className="text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Mi Perfil</span>
                    </a>
                    <a href="#" onClick={() => navigate('/orders')} className="text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Mis Pedidos</span>
                    </a>
                    <a href="#" onClick={handleLogout} className="text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </a>
                  </>
                ) : (
                  <a href="#" onClick={() => navigate('/login')} className="text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Mi Cuenta</span>
                  </a>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
