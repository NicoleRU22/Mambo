import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userService } from "@/services/api";

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
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await userService.updateUser(user.id, { name, email });
      onUpdate(updated.user);
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      alert("No se pudo actualizar el usuario");
    } finally {
      setLoading(false);
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
