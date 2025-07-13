import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userService } from "@/services/api";
import { toast } from "sonner";

interface EditUserModalProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  onClose: () => void;
  onUpdate: (updatedUser: { id: number; name: string; email: string }) => void;
}

export const EditUserModal = ({
  user,
  onClose,
  onUpdate,
}: EditUserModalProps) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user.name || "");
    setEmail(user.email || "");
  }, [user]);

  const handleSave = async () => {
    if (!user || !user.id) {
      console.error("Usuario inválido:", user);
      return;
    }

    try {
      await userService.updateUser(user.id, { name, email });
      toast.success("Usuario actualizado correctamente");
      onClose();
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      toast.error("Error actualizando usuario");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-4">Editar Usuario</h2>

        <Input
          className="mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
        />

        <Input
          className="mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
};
