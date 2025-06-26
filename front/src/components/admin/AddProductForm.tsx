import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface AddProductFormProps {
  onCancel: () => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 0,
    category: '',
    petTypes: {
      dog: false,
      cat: false,
      bird: false,
      fish: false,
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [status, setStatus] = useState('Sin Stock');

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (imageUrl) {
      setPreview(imageUrl);
    }
  }, [imageFile, imageUrl]);

  useEffect(() => {
    setStatus(formData.stock > 0 ? 'Activo' : 'Sin Stock');
  }, [formData.stock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'stock' ? parseInt(value) || 0 : value,
    }));
  };

  const handlePetTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      petTypes: {
        ...prev.petTypes,
        [type]: !prev.petTypes[type as keyof typeof formData.petTypes],
      },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl('');
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null);
  };

  const handleSubmit = () => {
    const product = {
      ...formData,
      status,
      image: imageUrl || (imageFile ? imageFile.name : ''),
    };

    console.log('📦 Producto agregado:', product);
    alert('Producto agregado (ver consola)');
  };

  return (
    <Card className="max-w-5xl mx-auto mt-6 p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Agregar Producto</CardTitle>
        <p className="text-sm text-gray-500 mt-1">Completa la información para registrar un nuevo producto</p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="name">Nombre del producto</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="number" value={formData.price} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Input
                id="status"
                readOnly
                value={status}
                className={`bg-gray-100 font-medium ${status === 'Activo' ? 'text-green-600' : 'text-red-600'}`}
              />
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" value={formData.category} onChange={handleChange} />
            </div>

            <div>
              <Label>Tipo de mascota</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {['Perro', 'Gato', 'Aves', 'Pez'].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.petTypes[type as keyof typeof formData.petTypes]}
                      onCheckedChange={() => handlePetTypeChange(type)}
                    />
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Imagen del producto</Label>

            <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
           e.preventDefault();
           const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith('image/')) {
           setImageFile(file);
           setImageUrl('');
           }
           }}
           className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500 cursor-pointer hover:bg-gray-50 transition"
           >
           Arrastra una imagen aquí
          </div>


            <p className="text-center text-gray-500 text-sm">o</p>

            <div className="space-y-2">
              <input type="file" accept="image/*" className="hidden" id="uploadFile" onChange={handleFileChange} />
              <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('uploadFile')?.click()}>
                Subir desde archivos
              </Button>

              <Button type="button" variant="ghost" className="w-full text-blue-600" onClick={() => setUseUrlInput(!useUrlInput)}>
                {useUrlInput ? 'Ocultar campo de URL' : 'Ingresar URL de imagen'}
              </Button>

              {useUrlInput && (
                <Input placeholder="https://ejemplo.com/imagen.jpg" value={imageUrl} onChange={handleImageUrlChange} />
              )}

              {preview && (
              <img
              src={preview}
              alt="Vista previa"
              className="rounded-md max-w-full max-h-40 object-contain border mt-2 mx-auto"
              />
            )}

            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-10">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className="bg-primary-600 hover:bg-primary-700 text-white" onClick={handleSubmit}>
            Agregar Producto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
