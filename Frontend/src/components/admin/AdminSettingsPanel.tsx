import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const AdminSettingsPanel = () => {
  const [storeName, setStoreName] = useState('Mambo Petshop');
  const [phone, setPhone] = useState('986 363 462');
  const [address, setAddress] = useState('Jhon Kennedy N°15');
  const [facebook, setFacebook] = useState('https://www.facebook.com/share/1A2JRb95Pa/?mibextid=wwXIfr');
  const [instagram, setInstagram] = useState('https://www.instagram.com/mambo.pets?igsh=ZGF3MWx4dWJib240');
  const [openingHours, setOpeningHours] = useState('Lun - Sáb: 9am - 6pm');
  const [email, setEmail] = useState('info@mambopetshop');

  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    alert('Configuraciones guardadas exitosamente');
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Configuración de la Tienda</h1>

      <Card>
        <CardHeader>
          <CardTitle>Datos del Negocio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nombre de la tienda</Label>
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} disabled={!editing} />
          </div>
          <div>
            <Label>Teléfono / WhatsApp</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing} />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} disabled={!editing} />
          </div>
          <div>
            <Label>Correo de contacto</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Facebook</Label>
            {editing ? (
              <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            ) : (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline block truncate"
              >
                {facebook}
              </a>
            )}
          </div>
          <div>
            <Label>Instagram</Label>
            {editing ? (
              <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            ) : (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 underline block truncate"
              >
                {instagram}
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horarios de Atención</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Horario</Label>
            <Input value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} disabled={!editing} />
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        {!editing && (
          <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            Editar
          </Button>
        )}
        {editing && (
          <>
            <Button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white">
              Guardar Cambios
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Cancelar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPanel;
