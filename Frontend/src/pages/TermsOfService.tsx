import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Users, CreditCard, Truck } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Aceptación de Términos',
      content: `Al acceder y utilizar Mambo Petshop, aceptas estar sujeto a estos términos y condiciones de servicio. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.`,
      icon: FileText
    },
    {
      title: 'Descripción del Servicio',
      content: `Mambo Petshop es una plataforma de comercio electrónico que ofrece productos para mascotas. Proporcionamos servicios de venta, envío y atención al cliente relacionados con productos para animales domésticos.`,
      icon: Truck
    },
    {
      title: 'Cuenta de Usuario',
      content: `Para realizar compras, debes crear una cuenta proporcionando información precisa y actualizada. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.`,
      icon: Users
    },
    {
      title: 'Precios y Pagos',
      content: `Todos los precios están en Soles (S/.) e incluyen impuestos aplicables. Nos reservamos el derecho de modificar precios en cualquier momento. Los pagos se procesan de forma segura a través de nuestros proveedores de pago autorizados.`,
      icon: CreditCard
    },
    {
      title: 'Envíos y Entregas',
      content: `Realizamos envíos a todo el Perú. Los tiempos de entrega varían según la ubicación y el método de envío seleccionado. No nos hacemos responsables por retrasos causados por factores fuera de nuestro control.`,
      icon: Truck
    },
    {
      title: 'Política de Devoluciones',
      content: `Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté en su empaque original y sin usar. Consulta nuestra política de devoluciones completa para más detalles.`,
      icon: Shield
    },
    {
      title: 'Privacidad y Datos',
      content: `Tu privacidad es importante para nosotros. Recopilamos y utilizamos tu información personal de acuerdo con nuestra Política de Privacidad. Al usar nuestro servicio, consientes el procesamiento de tus datos personales.`,
      icon: Shield
    },
    {
      title: 'Propiedad Intelectual',
      content: `Todo el contenido de Mambo Petshop, incluyendo textos, imágenes, logos y software, está protegido por derechos de autor y otras leyes de propiedad intelectual. No está permitida la reproducción sin autorización.`,
      icon: FileText
    },
    {
      title: 'Limitación de Responsabilidad',
      content: `Mambo Petshop no será responsable por daños indirectos, incidentales o consecuentes que puedan resultar del uso de nuestros servicios. Nuestra responsabilidad total está limitada al monto pagado por el producto.`,
      icon: Shield
    },
    {
      title: 'Modificaciones',
      content: `Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación. Es tu responsabilidad revisar periódicamente estos términos.`,
      icon: FileText
    }
  ];

  const contactInfo = {
    email: 'legal@mambopetshop.com',
    phone: '986 254 569',
    address: 'Jhon Kennedy N° 15'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Términos de Servicio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Última actualización: {new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed">
              Bienvenido a Mambo Petshop. Estos términos de servicio rigen el uso de nuestro sitio web y servicios. 
              Al acceder o utilizar nuestro servicio, aceptas estar sujeto a estos términos. Si tienes alguna pregunta, 
              no dudes en contactarnos.
            </p>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <section.icon className="h-5 w-5 text-primary-600" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notes */}
        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Notas Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-yellow-800">
              <li>• Estos términos constituyen un acuerdo legal entre tú y Mambo Petshop</li>
              <li>• El uso continuado del servicio después de cambios en los términos constituye aceptación</li>
              <li>• Las leyes peruanas rigen estos términos y cualquier disputa</li>
              <li>• Si alguna parte de estos términos es inválida, el resto permanece en vigor</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Email Legal</h4>
                <p className="text-gray-600">{contactInfo.email}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Teléfono</h4>
                <p className="text-gray-600">{contactInfo.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dirección</h4>
                <p className="text-gray-600">{contactInfo.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate('/privacy-policy')}
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            Política de Privacidad
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/devoluciones')}
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            Política de Devoluciones
          </Button>
          <Button
            onClick={() => navigate('/contact')}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Contactar Soporte
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService; 