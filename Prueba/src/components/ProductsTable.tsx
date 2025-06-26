
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

export const ProductsTable = () => {
  const products = [
    {
      id: 1,
      name: 'Collar Premium para Perros',
      category: 'Perros',
      price: 'S/.15.99',
      stock: 45,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'Comida Gourmet para Gatos',
      category: 'Gatos',
      price: 'S/.24.99',
      stock: 23,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'Juguete Interactivo',
      category: 'Perros',
      price: 'S/.12.50',
      stock: 0,
      status: 'Sin Stock',
      image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 4,
      name: 'Arena Sanitaria Premium',
      category: 'Gatos',
      price: 'S/.18.75',
      stock: 67,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 5,
      name: 'Acuario Decorativo',
      category: 'Peces',
      price: 'S/.89.99',
      stock: 12,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?auto=format&fit=crop&w=100&q=80'
    }
  ];

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Sin Stock</Badge>;
    }
    if (stock < 10) {
      return <Badge className="bg-yellow-500">Stock Bajo</Badge>;
    }
    return <Badge className="bg-green-500">Activo</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestión de Productos</CardTitle>
          <Button className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </div>
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Buscar productos..." className="pl-10" />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">ID: #{product.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="font-medium">{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {getStatusBadge(product.status, product.stock)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
