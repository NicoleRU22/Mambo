
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, ShoppingCart, Home, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          ¡Envío gratis en compras superiores a S/.50! 🐾
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <div className="w-18 h-14 ">
                <img
                  src="/logo2.jpeg"
                  alt="Logo Mambo Petshop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>


          {/* Search bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar ropa para tu mascota..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Account */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center space-x-1"
              onClick={() => navigate('/login')}
            >
              <User className="h-5 w-5" />
              <span className="hidden lg:inline">Mi Cuenta</span>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar ropa..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex mt-4 space-x-8">
          <a href="#" onClick={() => navigate('/')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 flex items-center space-x-1">
            <Home className="h-4 w-4" />
            <span>Inicio</span>
          </a>
          <a href="#" onClick={() => navigate('/catalog')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">Catálogo</a>
          <a href="#" onClick={() => navigate('/catalog?category=ofertas')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">Ofertas</a>
          <a href="#" onClick={() => navigate('/aboutus')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">Nosotros</a>
          <a href="#" onClick={() => navigate('/contact')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">Contáctanos</a>
          <a href="#" 
            onClick={() => navigate('/blog')} 
            className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 flex items-center space-x-1"
          >
            <Book className="h-4 w-4" />
            <span>Blog</span>
          </a>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <a href="#" onClick={() => navigate('/')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Inicio</a>
              <a href="#" onClick={() => navigate('/catalog')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Catálogo</a>
              <a href="#" onClick={() => navigate('/catalog?category=perros')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Perros</a>
              <a href="#" onClick={() => navigate('/catalog?category=gatos')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Gatos</a>
              <a href="#" onClick={() => navigate('/catalog?category=ofertas')} className="text-gray-700 hover:text-primary-600 font-medium py-2">Ofertas</a>
              <a href="#" className="text-gray-700 hover:text-primary-600 font-medium py-2">Blog</a>
              <div className="pt-3 border-t border-gray-200">
                <a href="#" onClick={() => navigate('/login')} className="text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Mi Cuenta</span>
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
