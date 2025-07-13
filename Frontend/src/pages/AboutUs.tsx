import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PawPrint, ShieldCheck, Users } from 'lucide-react';

const Nosotros = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const brands = [
    { id: 1, image: 'https://benitomoda.mx/cdn/shop/files/pp_grande.jpg?v=1613733106' },
    { id: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV2hHiHKRLgOvug4GtXdwOunFowdbBzkYktA&s' },
    { id: 3, image: 'https://cdn.worldvectorlogo.com/logos/royal-canin.svg' },
    { id: 4, image: 'https://pethome.club/wp-content/uploads/2024/11/PetHome_Variante1.png' },
    { id: 5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaqB_AwwLTt3FRxY8BF2txDuUEyhIUpJHLDE-qctbFkChGJHa8vseG1973tLaogDQ4mhM&usqp=CAU' },
  ];

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? brands.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === brands.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header />

      {/* Hero */}
      <section
        className="relative bg-cover bg-center h-[75vh] flex items-center justify-center"
        style={{
          backgroundImage:
            `url(https://i.pinimg.com/736x/9d/db/85/9ddb8519ada77b4faf3911dfc5cda993.jpg)`
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center text-white max-w-3xl px-4">
          <h1 className="text-5xl font-bold mb-4 text-purple-300">Conoce Mambo Pet Shop</h1>
          <p className="text-lg mb-6">
            Más que una tienda, somos una comunidad que cree en el amor, la salud y la felicidad de las mascotas.
          </p>
          <a href="#services" className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition">
            Descubre Más
          </a>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">

        {/* Misión y Visión */}
        <section className="grid md:grid-cols-2 gap-10">
  <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition text-center">
    <img
      src="https://i.pinimg.com/736x/44/cc/04/44cc04b7c56917713d343940d3bdbfd9.jpg"
      alt="Misión"
      className="w-28 h-28 object-cover rounded-full mx-auto mb-4"
    />
    <h3 className="text-2xl font-bold text-purple-700 mb-2">Nuestra Misión</h3>
    <p className="text-gray-700">
      Brindar bienestar y felicidad a las mascotas y sus familias ofreciendo productos y servicios de excelencia, con un enfoque humano y responsable.
    </p>
  </div>

  <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition text-center">
    <img
      src="https://i.pinimg.com/736x/83/18/92/831892915d16e521bac47d17153ede10.jpg"
      alt="Visión"
      className="w-28 h-28 object-cover rounded-full mx-auto mb-4"
    />
    <h3 className="text-2xl font-bold text-purple-700 mb-2">Nuestra Visión</h3>
    <p className="text-gray-700">
      Ser la tienda de mascotas más innovadora y confiable, liderando el cambio hacia una cultura de cuidado, educación y amor por los animales.
    </p>
  </div>
</section>


        {/* Servicios */}
        <section id="services" className="text-center">
          <h2 className="text-4xl font-bold text-purple-700 mb-4">Nuestros Servicios</h2>
          <p className="text-lg text-gray-600 mb-12">
            Cuidamos a tus mascotas como parte de nuestra familia.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-purple-400 to-violet-600 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <PawPrint className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Productos Premium</h4>
              <p>Alimentos, juguetes y accesorios seleccionados para su bienestar.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-purple-400 to-indigo-500 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <ShieldCheck className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Atención Veterinaria</h4>
              <p>Servicios médicos profesionales y humanos.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Adopciones Responsables</h4>
              <p>Unimos mascotas con hogares amorosos.</p>
            </div>
          </div>
        </section>

        {/* Carrusel */}
        <section className="text-center">
          <h3 className="text-3xl font-bold text-purple-700 mb-8">Nuestras Marcas Aliadas</h3>
          <div className="flex items-center justify-center gap-6 relative">
            <button
              className="text-3xl text-purple-600 hover:text-purple-800"
              onClick={goToPrev}
            >
              ‹
            </button>
            <div className="flex overflow-hidden">
              {brands.map((brand, index) => (
                <div
                  key={brand.id}
                  className={`w-40 h-40 mx-2 rounded-lg shadow transition-all duration-500 ${
                    index === activeIndex ? 'scale-110 opacity-100' : 'scale-90 opacity-40'
                  }`}
                >
                  <img
                    src={brand.image}
                    alt={`Marca ${brand.id}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ))}
            </div>
            <button
              className="text-3xl text-purple-600 hover:text-purple-800"
              onClick={goToNext}
            >
              ›
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Nosotros;
