// src/pages/Contact.tsx
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Smartphone, Mail, MapPin } from "lucide-react";
import Swal from "sweetalert2";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        {/* Banner */}
        <section className="mb-16 relative">
          {/* Fondo degradado */}
          <div className="h-48 md:h-64 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg"></div>
          {/* Overlay de contenido */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              Contáctanos
            </h1>
            <div className="mt-6 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 max-w-2xl">
              <p className="text-gray-800 text-center text-lg md:text-xl leading-relaxed">
                ¿Tienes preguntas, sugerencias o necesitas ayuda?
                <br />
                Nuestro equipo está listo para asistirte.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 flex items-start space-x-4">
              <div className="p-3 bg-primary-600 rounded-lg text-white">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Teléfono</h3>
                <p className="text-gray-600 mt-1">+51 986 254 569</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 flex items-start space-x-4">
              <div className="p-3 bg-green-500 rounded-lg text-white">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                <p className="text-gray-600 mt-1">+51 986 254 569</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 flex items-start space-x-4">
              <div className="p-3 bg-red-500 rounded-lg text-white">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Correo</h3>
                <p className="text-gray-600 mt-1">info@mambopetshop.com</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 flex items-start space-x-4">
              <div className="p-3 bg-indigo-600 rounded-lg text-white">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Nuestra Tienda</h3>
                <p className="text-gray-600 mt-1">Jhon Kennedy N°15, Pisco</p>
              </div>
            </div>

            {/* Mapa */}
            <div className="overflow-hidden rounded-xl shadow-lg">
              <iframe
                title="Mapa Mambo Petshop"
                src="https://maps.google.com/maps?q=MAMBO%20PETSHOP%2C%20Jhon%20Kennedy%2015%2C%20Pisco%2C%20Per%C3%BA&z=18&output=embed"
                className="w-full h-48"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Envíanos un mensaje
            </h2>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = {
                  name: (form.elements.namedItem("name") as HTMLInputElement)
                    .value,
                  email: (form.elements.namedItem("email") as HTMLInputElement)
                    .value,
                  subject: (
                    form.elements.namedItem("asunto") as HTMLInputElement
                  ).value,
                  message: (
                    form.elements.namedItem("mensaje") as HTMLTextAreaElement
                  ).value,
                };
                setLoading(true);
                try {
                  const res = await fetch(
                    `${API_URL}/contact/contact`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data),
                      credentials: "include", // si usas cookies o autenticación
                    }
                  );
                  if (res.ok) {
                    Swal.fire({
                      title: "¡Mensaje enviado!",
                      text: "Gracias por contactarnos. Te responderemos pronto.",
                      icon: "success",
                      confirmButtonText: "Aceptar",
                    });
                    form.reset();
                  } else {
                    const result = await res.json();
                    Swal.fire({
                      title: "Error",
                      text:
                        result.error || "Hubo un problema al enviar tu mensaje",
                      icon: "error",
                      confirmButtonText: "Aceptar",
                    });
                  }
                } catch (error) {
                  Swal.fire({
                    title: "Error",
                    text: "Error del servidor",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="asunto">Asunto</Label>
                <Input
                  id="asunto"
                  type="text"
                  placeholder="¿En qué podemos ayudarte?"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mensaje">Mensaje</Label>
                <textarea
                  id="mensaje"
                  rows={5}
                  placeholder="Escribe tu mensaje aquí..."
                  className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="mt-2 w-full bg-primary-600 hover:bg-primary-700"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
