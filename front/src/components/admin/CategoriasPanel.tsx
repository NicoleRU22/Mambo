import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { categoryService } from '@/services/api';

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

type CategoryInput = { name: string; description?: string };

export const CategoriasPanel = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const cats = await categoryService.getAll();
      setCategories(cats || []);
    } catch (err) {
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (cat: CategoryInput) => {
    try {
      await categoryService.create(cat);
      await loadCategories();
      setIsAddOpen(false);
      Swal.fire('Éxito', 'Categoría agregada', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo agregar la categoría', 'error');
    }
  };

  const handleEdit = async (cat: CategoryInput) => {
    if (!selectedCategory) return;
    try {
      await categoryService.update(selectedCategory.id, cat);
      await loadCategories();
      setIsEditOpen(false);
      setSelectedCategory(null);
      Swal.fire('Éxito', 'Categoría actualizada', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo actualizar la categoría', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      await categoryService.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      Swal.fire('Eliminado', 'Categoría eliminada', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
    }
  };

  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="p-2 md:p-4">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Categorías</CardTitle>
          <div className="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre..."
                className="pl-10"
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
              />
            </div>
            <Button variant="default" onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Categoría
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(cat => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.id}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell>{cat._count?.products ?? 0}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedCategory(cat); setIsEditOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">No se encontraron categorías.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modales para agregar/editar */}
      {isAddOpen && (
        <CategoriaModal
          onClose={() => setIsAddOpen(false)}
          onSave={handleAdd}
        />
      )}

      {isEditOpen && selectedCategory && (
        <CategoriaModal
          category={selectedCategory}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedCategory(null);
          }}
          onSave={handleEdit}
        />
      )}
    </div>
  );
};

// Modal para agregar/editar categoría sin imagen
const CategoriaModal = ({
  category,
  onClose,
  onSave
}: {
  category?: Category;
  onClose: () => void;
  onSave: (cat: CategoryInput) => void;
}) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');

  const isValid = name.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{category ? 'Editar' : 'Agregar'} Categoría</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button
            variant="default"
            disabled={!isValid}
            onClick={() => {
              onSave({ name, description });
              onClose();
            }}
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};
