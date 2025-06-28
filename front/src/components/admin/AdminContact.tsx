import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mail, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockMessages = [
  {
    id: 1,
    name: 'Ana Pérez',
    email: 'ana@example.com',
    subject: 'Consulta sobre envío',
    message: 'Hola, ¿cuánto tarda en llegar un pedido a Lima?',
    createdAt: '2025-06-25 10:30',
  },
  {
    id: 2,
    name: 'Carlos López',
    email: 'carlos@example.com',
    subject: 'Problema con el pago',
    message: 'Intenté pagar con tarjeta y no funcionó.',
    createdAt: '2025-06-24 15:10',
  },
  {
    id: 3,
    name: 'Lucía Torres',
    email: 'lucia@example.com',
    subject: 'Reclamo por producto',
    message: 'El producto llegó dañado, ¿pueden ayudarme?',
    createdAt: '2025-06-23 18:45',
  },
];

const AdminContact = () => {
  const handleReply = (email: string) => {
    alert(`Responder manualmente a: ${email}`);
  };

  const handleAutoReply = (email: string) => {
    alert(`Se ha enviado una respuesta automática a: ${email}`);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary-600" />
            Mensajes de Contacto
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className="border p-4 rounded bg-white shadow-sm space-y-2"
            >
              <div className="font-semibold text-lg text-primary-700">{msg.subject}</div>
              <div className="text-sm text-gray-500">
                {msg.name} - {msg.email} - {msg.createdAt}
              </div>
              <p className="text-gray-700">{msg.message}</p>

              <div className="flex flex-wrap gap-2 pt-2">
  <Button
    size="sm"
    variant="default"
    className="px-2 py-1 text-xs"
    onClick={() => handleReply(msg.email)}
  >
    <Reply className="mr-1 h-4 w-4" />
    Responder
  </Button>

  <Button
    size="sm"
    variant="secondary"
    className="px-2 py-1 text-xs"
    onClick={() => handleAutoReply(msg.email)}
  >
    Respuesta automática
  </Button>
</div>

            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContact;
