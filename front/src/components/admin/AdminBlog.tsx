// src/components/admin/AdminBlog.tsx

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const AdminBlog = () => {
  const [formData, setFormData] = useState({
    category: '',
    date: '',
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    imageFile: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    if (key === 'imageUrl') {
      setFormData((prev) => ({ ...prev, imageUrl: value, imageFile: null }));
      setImagePreview(value || null);
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageFile: file, imageUrl: '' }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      image: formData.imageFile ? '[Archivo]' : formData.imageUrl,
    };
    console.log('Datos del blog:', dataToSubmit);
    // Enviar a API o base de datos si se desea
  };

  return (
    <div className="p-1 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Blog</h1>
      <p className="text-gray-600 mb-8">
        Agregar una nueva publicación al blog
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de artículo */}
        <div>
          <Label className="mb-1 block">Tipo de artículo</Label>
          <Select onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cuidado">Cuidado</SelectItem>
              <SelectItem value="Juguetes">Juguetes</SelectItem>
              <SelectItem value="Alimentación">Alimentación</SelectItem>
              <SelectItem value="Entrenamiento">Entrenamiento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fecha */}
        <div>
          <Label htmlFor="date">Fecha</Label>
          <Input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        {/* Título */}
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            type="text"
            id="title"
            placeholder="Título del artículo"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Descripción */}
        <div>
          <Label htmlFor="description">Descripción corta</Label>
          <Input
            type="text"
            id="description"
            placeholder="Breve descripción del artículo"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* Contenido */}
        <div>
          <Label htmlFor="content">Contenido</Label>
          <Textarea
            id="content"
            rows={6}
            placeholder="Escribe el contenido completo aquí..."
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
          />
        </div>

        {/* Imagen desde archivo */}
        <div>
          <Label htmlFor="imageFile">Subir imagen desde tu dispositivo</Label>
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            disabled={!!formData.imageUrl}
            onChange={handleImageFileChange}
          />
        </div>

        {/* Imagen desde URL */}
        <div>
          <Label htmlFor="imageUrl">O ingresar URL de imagen</Label>
          <Input
            type="text"
            id="imageUrl"
            placeholder="https://..."
            value={formData.imageUrl}
            disabled={!!formData.imageFile}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
          />
        </div>

        {/* Vista previa */}
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Vista previa de imagen:</p>
            <img
              src={imagePreview}
              alt="Vista previa"
              className="w-full max-w-sm rounded-lg border"
            />
          </div>
        )}

        <div className="pt-6">
          <Button type="submit" className="w-full">
            Publicar artículo
          </Button>
        </div>
      </form>
    </div>
  );
};
