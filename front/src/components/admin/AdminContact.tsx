import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

const AdminContact = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/messages");
      if (!res.ok) throw new Error("Error al obtener mensajes");
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoReply = async (id: number, email: string) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/messages/reply/${id}`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error("Error al enviar respuesta");
      toast.success(`Se envió respuesta automática a: ${email}`);
    } catch (e) {
      toast.error("No se pudo enviar la respuesta");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-1 space-y-1">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary-600" />
            Mensajes de Contacto
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && <p>Cargando mensajes...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="border p-4 rounded bg-white shadow-sm space-y-2"
            >
              <div className="font-semibold text-lg text-primary-700">
                {msg.subject}
              </div>
              <div className="text-sm text-gray-500">
                {msg.name} - {msg.email} -{" "}
                {new Date(msg.createdAt).toLocaleString("es-PE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              <p className="text-gray-700">{msg.message}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  variant="default"
                  className="px-2 py-1 text-xs"
                  onClick={() => window.open(`mailto:${msg.email}`)}
                >
                  <Reply className="mr-1 h-4 w-4" />
                  Responder
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  className="px-2 py-1 text-xs"
                  onClick={() => handleAutoReply(msg.id, msg.email)}
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
