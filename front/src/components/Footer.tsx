import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const isEmailValid = email.trim() !== '' && email.includes('@');

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter section */}
      <div className="bg-primary-600 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">¡Mantente al día con Mambo Petshop!</h3>
            <p className="text-primary-100 mb-6">
              Recibe ofertas exclusivas, consejos para mascotas y las últimas novedades directamente en tu email
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-gray-900 border-0 flex-1"
              />
              <Button 
                variant="secondary" 
                className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 disabled:opacity-50"
                onClick={() => navigate('/newsletter')}
                disabled={!isEmailValid}
              >
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary-500 shadow-lg">
                    <img
                      src="/logo.jpeg"
                      alt="Logo Mambo Petshop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tu tienda de confianza para el cuidado y bienestar de tus mascotas. 
                Productos de calidad y atención personalizada desde 2020.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/profile.php?id=100065252930306" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                    <FaFacebookF className="w-4 h-4" />
                  </div>
                </a>
                <a href="https://www.instagram.com/mambo.pets/" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                    <FaInstagram className="w-4 h-4" />
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                    <FaTwitter className="w-4 h-4" />
                  </div>
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">Inicio</button></li>
                <li><button onClick={() => navigate('/catalog')} className="text-gray-400 hover:text-white transition-colors">Productos</button></li>
                <li><button onClick={() => navigate('/ofertas')} className="text-gray-400 hover:text-white transition-colors">Ofertas</button></li>
                <li><button onClick={() => navigate('/blog')} className="text-gray-400 hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="text-gray-400 hover:text-white transition-colors">Contacto</button></li>
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <div>
                  <strong className="text-white">Dirección:</strong><br />
                  Jhon Kennedy<br />
                  N° 15
                </div>
                <div>
                  <strong className="text-white">Teléfono:</strong><br />
                  986 254 569
                </div>
                <div>
                  <strong className="text-white">Email:</strong><br />
                  info@mambopetshop.com
                </div>
                <div>
                  <strong className="text-white">Horarios:</strong><br />
                  Lun - Vie: 9:00 - 19:00<br />
                  Sáb: 9:00 - 17:00<br />
                  Dom: 10:00 - 15:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Mambo Petshop. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button onClick={() => navigate('/privacy-policy')} className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidad</button>
              <button onClick={() => navigate('/terms-of-service')} className="text-gray-400 hover:text-white text-sm transition-colors">Términos de Servicio</button>
              <button onClick={() => navigate('/devoluciones')} className="text-gray-400 hover:text-white text-sm transition-colors">Devoluciones</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
