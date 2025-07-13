import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Bell, Gift, Tag, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const Newsletter = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const benefits = [
    {
      icon: Gift,
      title: 'Ofertas Exclusivas',
      description: 'Recibe descuentos especiales solo para suscriptores'
    },
    {
      icon: Tag,
      title: 'Primer Acceso',
      description: 'Sé el primero en conocer nuevos productos y promociones'
    },
    {
      icon: Bell,
      title: 'Consejos Útiles',
      description: 'Tips y consejos para el cuidado de tu mascota'
    },
    {
      icon: Mail,
      title: 'Contenido Personalizado',
      description: 'Recibe recomendaciones basadas en tus preferencias'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos requeridos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (!acceptTerms) {
      Swal.fire({
        title: 'Error',
        text: 'Debes aceptar los términos y condiciones',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    setLoading(true);

    try {
      // Aquí iría la llamada a la API para suscribir al newsletter
      // await newsletterService.subscribe({ email, name, acceptMarketing });
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      Swal.fire({
        title: '¡Suscripción Exitosa!',
        text: 'Gracias por suscribirte a nuestro newsletter. Pronto recibirás nuestras mejores ofertas.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        setEmail('');
        setName('');
        setAcceptMarketing(false);
        setAcceptTerms(false);
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al suscribirte. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
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

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Mail className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Únete a Nuestra Comunidad!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Suscríbete a nuestro newsletter y recibe las mejores ofertas, consejos para mascotas 
              y novedades directamente en tu email.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Benefits */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">¿Por qué Suscribirte?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                          <p className="text-gray-600 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">+5,000 Suscriptores</h3>
                    <p className="text-primary-100">
                      Ya confían en nosotros para recibir las mejores ofertas
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle>Lo que dicen nuestros suscriptores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary-500 pl-4">
                      <p className="text-gray-700 italic">
                        "Gracias al newsletter conseguí un 30% de descuento en la comida de mi perro. ¡Excelente!"
                      </p>
                      <p className="text-sm text-gray-500 mt-2">- María G.</p>
                    </div>
                    <div className="border-l-4 border-primary-500 pl-4">
                      <p className="text-gray-700 italic">
                        "Los consejos que envían son muy útiles para cuidar mejor a mi gato."
                      </p>
                      <p className="text-sm text-gray-500 mt-2">- Carlos L.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Suscríbete Ahora</CardTitle>
                  <p className="text-gray-600">
                    Completa el formulario y recibe contenido exclusivo
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={acceptMarketing}
                        onCheckedChange={(checked) => setAcceptMarketing(checked as boolean)}
                      />
                      <Label htmlFor="marketing" className="text-sm">
                        Acepto recibir comunicaciones de marketing personalizadas
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm">
                        Acepto los{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/terms-of-service')}
                          className="text-primary-600 hover:underline"
                        >
                          términos y condiciones
                        </button>{' '}
                        y la{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/privacy-policy')}
                          className="text-primary-600 hover:underline"
                        >
                          política de privacidad
                        </button>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary-600 hover:bg-primary-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Suscribiendo...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Suscribirse
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                    <h3 className="font-semibold">Suscripción Gratuita</h3>
                    <p className="text-sm text-gray-600">
                      No te cobramos nada por suscribirte. Puedes cancelar en cualquier momento.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">¿Con qué frecuencia envían emails?</h4>
                  <p className="text-gray-600">
                    Enviamos emails 1-2 veces por semana con ofertas especiales, consejos útiles y novedades.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">¿Puedo cancelar mi suscripción?</h4>
                  <p className="text-gray-600">
                    Sí, puedes cancelar tu suscripción en cualquier momento haciendo clic en el enlace "Cancelar suscripción" al final de cualquier email.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">¿Venden mi información a terceros?</h4>
                  <p className="text-gray-600">
                    No, nunca vendemos, alquilamos o compartimos tu información personal con terceros. Consulta nuestra política de privacidad para más detalles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Newsletter; 