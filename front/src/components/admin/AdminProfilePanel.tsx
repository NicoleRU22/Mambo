import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AdminProfilePanel = () => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: 'Administrador',
    email: 'admin@example.com',
    phone: '999999999',
    address: 'Av. Siempre Viva 123',
    city: 'Lima',
    state: 'Lima',
    zip_code: '15001',
    created_at: '2024-01-01',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-1 md:p-1">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Perfil del Administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <Input name="name" value={form.name} onChange={handleChange} disabled={!editMode} />
          </div>
          <div>
            <label className="block text-sm font-medium">Correo</label>
            <Input name="email" value={form.email} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium">Teléfono</label>
            <Input name="phone" value={form.phone} onChange={handleChange} disabled={!editMode} />
          </div>
          <div>
            <label className="block text-sm font-medium">Dirección</label>
            <Input name="address" value={form.address} onChange={handleChange} disabled={!editMode} />
          </div>
          <div>
            <label className="block text-sm font-medium">Ciudad</label>
            <Input name="city" value={form.city} onChange={handleChange} disabled={!editMode} />
          </div>
          <div>
            <label className="block text-sm font-medium">Departamento</label>
            <Input name="state" value={form.state} onChange={handleChange} disabled={!editMode} />
          </div>
          <div>
            <label className="block text-sm font-medium">Código Postal</label>
            <Input name="zip_code" value={form.zip_code} onChange={handleChange} disabled={!editMode} />
          </div>
          <div>
            <label className="block text-sm font-medium">Registrado desde</label>
            <Input
              value={new Date(form.created_at).toLocaleDateString('es-PE')}
              disabled
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            {!editMode ? (
              <Button variant="secondary" onClick={() => setEditMode(true)}>
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setEditMode(false);
                    alert('Cambios guardados localmente (sin backend).');
                  }}
                >
                  Guardar Cambios
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfilePanel;
