import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, HeartHandshake, PawPrint, Users, Truck, Sparkles } from 'lucide-react';

const Nosotros = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Estado para el índice activo del carrusel

  const brands = [
    { id: 1, image: 'https://benitomoda.mx/cdn/shop/files/pp_grande.jpg?v=1613733106' },
    { id: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV2hHiHKRLgOvug4GtXdwOunFowdbBzkYktA&s' },
    { id: 3, image: 'https://cdn.worldvectorlogo.com/logos/royal-canin.svg' },
    { id: 4, image: 'https://pethome.club/wp-content/uploads/2024/11/PetHome_Variante1.png' },
    { id: 5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaqB_AwwLTt3FRxY8BF2txDuUEyhIUpJHLDE-qctbFkChGJHa8vseG1973tLaogDQ4mhM&usqp=CAU' },
  ];

  // Navegar a la marca anterior
  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? brands.length - 1 : prevIndex - 1));
  };

  // Navegar a la siguiente marca
  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === brands.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 relative">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://i.pinimg.com/736x/9d/db/85/9ddb8519ada77b4faf3911dfc5cda993.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center text-white">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600 mb-4">
            Conoce Mambo Pet Shop
          </h1>
          <p className="text-xl font-semibold mb-8 max-w-2xl mx-auto">
            Más que una tienda, somos una comunidad que cree en el amor, la salud y la felicidad de las mascotas.
          </p>
          <a href="#services" className="px-6 py-3 bg-gradient-to-r from-teal-400 to-purple-600 text-white rounded-full text-lg font-semibold hover:scale-105 transform transition">
            Descubre Más
          </a>
        </div>
      </div>

      <main className="px-4 md:px-12 py-16 space-y-20">
        
        {/* Misión y Visión */}
        <section className="grid md:grid-cols-2 gap-16 mb-16">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-indigo-600 to-pink-500 opacity-50"></div>
            <div className="relative z-10 p-10 bg-white shadow-xl rounded-xl hover:scale-105 transition-all duration-500">
              <img src="https://i.pinimg.com/736x/44/cc/04/44cc04b7c56917713d343940d3bdbfd9.jpg" alt="Misión" className="w-32 h-32 rounded-full object-cover mb-6 mx-auto" />
              <h3 className="text-3xl font-bold text-teal-700 mb-4">Nuestra Misión</h3>
              <p className="text-gray-800 text-lg leading-relaxed">
                Brindar bienestar y felicidad a las mascotas y sus familias ofreciendo productos y servicios de excelencia, con un enfoque humano y responsable.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-green-600 to-teal-500 opacity-50"></div>
            <div className="relative z-10 p-10 bg-white shadow-xl rounded-xl hover:scale-105 transition-all duration-500">
              <img src="https://i.pinimg.com/736x/83/18/92/831892915d16e521bac47d17153ede10.jpg" alt="Visión" className="w-32 h-32 rounded-full object-cover mb-6 mx-auto" />
              <h3 className="text-3xl font-bold text-teal-700 mb-4">Nuestra Visión</h3>
              <p className="text-gray-800 text-lg leading-relaxed">
                Ser la tienda de mascotas más innovadora y confiable, liderando el cambio hacia una cultura de cuidado, educación y amor por los animales.
              </p>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-white mb-8">Nuestros Servicios</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-12">
            Descubre todo lo que tenemos para ofrecer y cómo cuidamos a tus mascotas como parte de nuestra familia.
          </p>
        </div>

        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-12 text-center mb-16">
          <div className="bg-white shadow-2xl p-8 rounded-xl transform hover:scale-110 transition-all duration-500">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <PawPrint className="text-white" size={48} />
            </div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Productos Premium</h4>
            <p className="text-gray-600 text-lg">
              Alimentos, juguetes y accesorios seleccionados para ofrecer bienestar y diversión.
            </p>
          </div>

          <div className="bg-white shadow-2xl p-8 rounded-xl transform hover:scale-110 transition-all duration-500">
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-white" size={48} />
            </div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Atención Veterinaria</h4>
            <p className="text-gray-600 text-lg">
              Servicios médicos profesionales y humanos para una vida saludable.
            </p>
          </div>

          <div className="bg-white shadow-2xl p-8 rounded-xl transform hover:scale-110 transition-all duration-500">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-white" size={48} />
            </div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Adopciones Responsables</h4>
            <p className="text-gray-600 text-lg">
              Unimos mascotas con hogares amorosos en procesos éticos y seguros.
            </p>
          </div>
        </section>

        {/* Carrusel de Marcas */}
          <div className="bg-white rounded-xl shadow-md p-12 mb-20">
            <h3 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Nuestras Marcas Aliadas</h3>
            <div className="relative flex items-center justify-center gap-12">
              {/* Flecha izquierda */}
              <button
                className="absolute left-0 text-yellow-500 text-4xl z-10 hover:text-yellow-400 transition-all duration-200"
                onClick={goToPrev}
              >
                &#10094;
              </button>

              <div className="flex space-x-6 overflow-hidden">
                {brands.map((brand, index) => (
                  <div
                    key={brand.id}
                    className={`transition-all transform duration-500 ease-in-out flex-shrink-0 w-48 h-48 rounded-lg ${
                      index === activeIndex ? 'scale-110 shadow-xl' : 'scale-90 opacity-50'
                    }`}
                  >
                    <img
                      src={brand.image}
                      alt={`Marca ${brand.id}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Flecha derecha */}
              <button
                className="absolute right-0 text-yellow-500 text-4xl z-10 hover:text-yellow-400 transition-all duration-200"
                onClick={goToNext}
              >
                &#10095;
              </button>
            </div>
          </div>


      </main>
      <Footer />
    </div>
  );
};

export default Nosotros;
