
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Truck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16 md:py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100 to-transparent rounded-full opacity-20 -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-100 to-transparent rounded-full opacity-20 translate-y-48 -translate-x-48"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                ¡Nueva! Colección Invierno 2025
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Moda exclusiva para
              <span className="text-primary-600 block">tu mejor amigo</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Descubre la mejor selección de ropa para perros y gatos. 
              Diseños únicos, materiales de calidad y el confort que tu mascota merece.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg group"
                onClick={() => navigate('/catalog')}
              >
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 text-lg"
                onClick={() => navigate('/aboutus')}
              >
                Conócenos
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">Calidad Premium</div>
                <div className="text-xs text-gray-500">Materiales suaves</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">Envío 24h</div>
                <div className="text-xs text-gray-500">Gratis + S/.50</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">Garantía</div>
                <div className="text-xs text-gray-500">30 días</div>
              </div>
            </div>
          </div>
          
          {/* Right content - Hero image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80"
                alt="Perro con ropa elegante"
                className="w-full h-96 md:h-[500px] object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Suéter Cozy Winter</h3>
                    <p className="text-sm text-gray-600">Disponible en 5 tallas</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">S/.24.99</div>
                    <div className="text-sm text-gray-500 line-through">S/.34.99</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
