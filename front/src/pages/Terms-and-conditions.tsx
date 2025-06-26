import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
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
          Volver a Registrarse
        </Button>

        <Card className="shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <CardTitle className="text-4xl font-semibold">Términos y Condiciones</CardTitle>
            <p className="text-gray-200 mt-2 text-lg">Por favor, lee estos términos antes de utilizar nuestros servicios.</p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 py-4 bg-white">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">1. Introducción</h3>
              <p className="text-lg text-gray-700">
                Bienvenido a <strong>Mambo Pet Shop</strong>. Al acceder y utilizar nuestros servicios, aceptas estos Términos y Condiciones. Si no estás de acuerdo con estos términos, por favor no utilices nuestro sitio.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800">2. Uso del Servicio</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li><strong>2.1</strong> El acceso y uso de los servicios de <strong>Mambo Pet Shop</strong> está destinado solo a usuarios que tienen la capacidad legal para aceptar estos Términos.</li>
                <li><strong>2.2</strong> Nos reservamos el derecho de modificar, actualizar o interrumpir el servicio sin previo aviso.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800">3. Propiedad Intelectual</h3>
              <p className="text-lg text-gray-700">
                Todo el contenido de este sitio, incluyendo textos, gráficos, logotipos, imágenes y software, es propiedad de <strong>Mambo Pet Shop</strong> y está protegido por las leyes de propiedad intelectual.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800">4. Privacidad y Protección de Datos</h3>
              <p className="text-lg text-gray-700">
                El uso de este sitio está sujeto a nuestra <a href="/privacy-policy" className="text-primary-600">Política de Privacidad</a>, que regula cómo manejamos tus datos personales.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800">5. Responsabilidad del Usuario</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li><strong>5.1</strong> El usuario es responsable de cualquier actividad realizada a través de su cuenta en <strong>Mambo Pet Shop</strong>.</li>
                <li><strong>5.2</strong> El usuario debe notificar de inmediato cualquier uso no autorizado de su cuenta.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800">6. Limitación de Responsabilidad</h3>
              <p className="text-lg text-gray-700">
                <strong>Mambo Pet Shop</strong> no será responsable de ningún daño directo, indirecto, incidental o consecuente derivado del uso de este sitio web o de los servicios ofrecidos.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800">7. Modificaciones de los Términos</h3>
              <p className="text-lg text-gray-700">
                Nos reservamos el derecho de actualizar estos Términos en cualquier momento. Los cambios serán efectivos una vez publicados en este sitio.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800">8. Legislación Aplicable</h3>
              <p className="text-lg text-gray-700">
                Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de [tu país o región].
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;

