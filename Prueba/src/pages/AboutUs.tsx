import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, HeartHandshake, PawPrint, Users, Truck, Sparkles } from 'lucide-react';

const Nosotros = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100">
      <Header />
      <main className="animate-fade-in">
        {/* Hero Section with Background Image */}
        <div className="relative h-[400px] w-full flex items-center justify-center text-center">
          <img src="https://i.pinimg.com/736x/9d/db/85/9ddb8519ada77b4faf3911dfc5cda993.jpg" alt="Fondo" className="absolute inset-0 w-full h-full object-cover opacity-90" />
          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4">Conoce Mambo Pet Shop</h1>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Más que una tienda, somos una comunidad que cree en el amor, la salud y la felicidad de las mascotas.
            </p>
          </div>
        </div>

        {/* Misión y Visión */}
        <section className="grid md:grid-cols-2 gap-12 my-20">
          <div className="flex flex-col items-center text-center bg-white shadow-xl p-6 rounded-xl hover:scale-105 transition-transform">
            <img src="https://drive.google.com/uc?export=view&id=MISION_IMAGE_ID" alt="Misión" className="w-28 h-28 rounded-full object-cover mb-4" />
            <h3 className="flex items-center gap-2 text-xl font-bold text-purple-700 mb-2">
              <HeartHandshake /> Nuestra Misión
            </h3>
            <p className="text-gray-800 text-md leading-relaxed">
              Brindar bienestar y felicidad a las mascotas y sus familias ofreciendo productos y servicios de excelencia, con un enfoque humano y responsable.
            </p>
          </div>

          <div className="flex flex-col items-center text-center bg-white shadow-xl p-6 rounded-xl hover:scale-105 transition-transform">
            <img src="https://drive.google.com/uc?export=view&id=VISION_IMAGE_ID" alt="Visión" className="w-28 h-28 rounded-full object-cover mb-4" />
            <h3 className="flex items-center gap-2 text-xl font-bold text-green-700 mb-2">
              <ShieldCheck /> Nuestra Visión
            </h3>
            <p className="text-gray-800 text-md leading-relaxed">
              Ser la tienda de mascotas más innovadora y confiable, liderando el cambio hacia una cultura de cuidado, educación y amor por los animales.
            </p>
          </div>
        </section>

        {/* Servicios */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Servicios</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Descubre todo lo que tenemos para ofrecer y cómo cuidamos a tus mascotas como parte de nuestra familia.
          </p>
        </div>

        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 text-center mb-20">
          <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition group">
            <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-300">
              <PawPrint className="text-orange-600 group-hover:text-white" size={36} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Productos Premium</h4>
            <p className="text-sm text-gray-600">
              Alimentos, juguetes y accesorios seleccionados para ofrecer bienestar y diversión.
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition group">
            <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-300">
              <ShieldCheck className="text-blue-600 group-hover:text-white" size={36} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Atención Veterinaria</h4>
            <p className="text-sm text-gray-600">
              Servicios médicos profesionales y humanos para una vida saludable.
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition group">
            <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-300">
              <Users className="text-purple-600 group-hover:text-white" size={36} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Adopciones Responsables</h4>
            <p className="text-sm text-gray-600">
              Unimos mascotas con hogares amorosos en procesos éticos y seguros.
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition group">
            <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-300">
              <Truck className="text-yellow-600 group-hover:text-white" size={36} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Grooming & Spa</h4>
            <p className="text-sm text-gray-600">
              Cuidado estético, baño y relax para que tu mascota se sienta increíble.
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition group">
            <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-300">
              <Sparkles className="text-red-500 group-hover:text-white" size={36} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Blog Educativo</h4>
            <p className="text-sm text-gray-600">
              Consejos y guías prácticas para aprender a cuidar a tu mejor amigo.
            </p>
          </div>
        </section>

        {/* Carousel de Marcas */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Nuestras Marcas Aliadas</h3>
          <div className="overflow-x-auto whitespace-nowrap flex gap-8 items-center justify-center animate-scroll-slow">
            <img src="https://drive.google.com/uc?export=view&id=MARCA1_ID" alt="Marca 1" className="h-16 hover:opacity-80 transition" />
            <img src="https://drive.google.com/uc?export=view&id=MARCA2_ID" alt="Marca 2" className="h-16 hover:opacity-80 transition" />
            <img src="https://drive.google.com/uc?export=view&id=MARCA3_ID" alt="Marca 3" className="h-16 hover:opacity-80 transition" />
            <img src="https://drive.google.com/uc?export=view&id=MARCA4_ID" alt="Marca 4" className="h-16 hover:opacity-80 transition" />
            <img src="https://drive.google.com/uc?export=view&id=MARCA5_ID" alt="Marca 5" className="h-16 hover:opacity-80 transition" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Nosotros;