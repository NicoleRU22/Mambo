import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import Swal from "sweetalert2";

import { EditProductModal } from './EditProductModal';
import { AddProductModal } from './AddProductModal';
import { productService, categoryService } from '@/services/api';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  petType: string;
  images: string[];
  sizes: string[];
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

export const ProductsTable = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Cargar productos y categorías
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllAdmin(),
          categoryService.getAll(),
        ]);

        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await productService.update(updatedProduct.id, {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        originalPrice: updatedProduct.originalPrice,
        stock: updatedProduct.stock,
        petType: updatedProduct.petType,
        images: updatedProduct.images,
        sizes: updatedProduct.sizes,
        categoryId: updatedProduct.categoryId,
      });

      // Actualizar la lista local
      setProducts(prevProducts =>
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;

    try {
      await productService.delete(productId);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      await Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
    } catch (error) {
      console.error('Error deleting product:', error);
      await Swal.fire("Error", "No se pudo eliminar el producto. Intenta de nuevo.", "error");
    }
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const createdProduct = await productService.create({
        name: newProduct.name,
        description: newProduct.description || '',
        price: newProduct.price,
        originalPrice: newProduct.originalPrice,
        stock: newProduct.stock,
        petType: newProduct.petType,
        images: newProduct.images || [],
        sizes: newProduct.sizes || [],
        categoryId: newProduct.categoryId,
      });

      setProducts(prevProducts => [...prevProducts, createdProduct]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    }
  };

  const getStatusBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Sin Stock</Badge>;
    if (stock < 10) return <Badge className="bg-yellow-500">Stock Bajo</Badge>;
    return <Badge className="bg-green-500">Activo</Badge>;
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return 'Sin categoría';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(filterName.toLowerCase());
    const categoryMatch = filterCategory === '' || getCategoryName(product.categoryId) === filterCategory;
    const statusMatch = filterStatus === '' || 
      (filterStatus === 'Activo' && product.stock > 10) ||
      (filterStatus === 'Stock Bajo' && product.stock <= 10 && product.stock > 0) ||
      (filterStatus === 'Sin Stock' && product.stock === 0);

    return nameMatch && categoryMatch && statusMatch;
  });

  const clearFilters = () => {
    setFilterName('');
    setFilterCategory('');
    setFilterStatus('');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p>Cargando productos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <CardTitle>Gestión de Productos</CardTitle>
            <Button
              className="bg-primary-600 hover:bg-primary-700"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Ocultar Filtros' : 'Filtros'}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="border rounded px-3 py-2 text-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                className="border rounded px-3 py-2 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Sin Stock">Sin Stock</option>
                <option value="Stock Bajo">Stock Bajo</option>
              </select>
              <Button variant="ghost" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          )}
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
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">ID: #{product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                  <TableCell className="font-medium">
                    S/.{product.price}
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        S/.{product.originalPrice}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.stock)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log('Ver', product.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditProductModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onUpdate={handleUpdateProduct}
        categories={categories}
      />

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
        categories={categories}
      />
    </>
  );
};

