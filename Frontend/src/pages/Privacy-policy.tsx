import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/register')}  // Redirige a la página de registro
          className="mb-6 text-white hover:text-gray-900 transition-colors duration-300"
        >
          Volver 
        </Button>

        <Card className="shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <CardTitle className="text-4xl font-semibold">Política de Privacidad</CardTitle>
            <p className="text-gray-200 mt-2 text-lg">Tu privacidad es importante para nosotros. Lee cómo protegemos tus datos personales.</p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 py-4 bg-white">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">1. Introducción</h3>
              <p className="text-lg text-gray-700">
                En <strong>Mambo Pet Shop</strong>, nos comprometemos a proteger tu privacidad y asegurar que tu experiencia en línea sea segura. Esta política explica cómo recopilamos, utilizamos y protegemos tus datos personales.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800">2. Información que Recopilamos</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li><strong>2.1</strong> Recopilamos información personal cuando te registras en nuestro sitio, realizas compras o interactúas con nuestros servicios. Esto puede incluir tu nombre, dirección de correo electrónico, dirección física y otra información relacionada.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800">3. Uso de la Información</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li><strong>3.1</strong> Utilizamos la información recopilada para proporcionar y mejorar nuestros servicios, procesar pagos, responder a consultas y ofrecerte promociones o actualizaciones relevantes.</li>
                <li><strong>3.2</strong> Podemos utilizar tus datos para enviarte comunicaciones de marketing, pero podrás optar por no recibirlos en cualquier momento.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800">4. Compartir Información con Terceros</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li><strong>4.1</strong> No vendemos ni alquilamos tu información personal a terceros. Sin embargo, podemos compartirla con proveedores de servicios que nos ayuden a operar nuestro sitio o realizar actividades de marketing.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800">5. Seguridad de los Datos</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li><strong>5.1</strong> Tomamos medidas de seguridad para proteger tu información personal contra acceso no autorizado, alteración o destrucción. Sin embargo, ninguna transmisión de datos por internet puede garantizarse completamente segura.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800">6. Tus Derechos</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li><strong>6.1</strong> Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento. Si deseas ejercer estos derechos, contáctanos a través de [tu dirección de contacto].</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800">7. Cambios en la Política de Privacidad</h3>
              <p className="text-lg text-gray-700">
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Los cambios serán efectivos una vez publicados en este sitio.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800">8. Contacto</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li><strong>8.1</strong> Si tienes preguntas o inquietudes sobre esta política, contáctanos a través de [tu dirección de contacto].</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

