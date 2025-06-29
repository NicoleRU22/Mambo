import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react'; 

interface Usuario {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export const UsuariosPanel = () => {
  const usuarios: Usuario[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'user',
      createdAt: '2024-05-20T14:00:00Z',
    },
    {
      id: 2,
      name: 'María López',
      email: 'maria@example.com',
      role: 'admin',
      createdAt: '2023-12-15T10:30:00Z',
    },
    {
      id: 3,
      name: 'Carlos Ruiz',
      email: 'carlos@example.com',
      role: 'user',
      createdAt: '2024-01-10T09:15:00Z',
    },
  ];

  // Función para editar un usuario (por ejemplo, mostrar un modal o redirigir a una página de edición)
  const handleEdit = (id: number) => {
    alert(`Editar usuario con ID: ${id}`);
  };

  // Función para eliminar un usuario (por ejemplo, mostrar un mensaje de confirmación antes de eliminar)
  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (isConfirmed) {
      alert(`Usuario con ID: ${id} eliminado.`);
    }
  };

  return (
    <div className="p-1 md:p-1">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Nuestros Usuarios
          </CardTitle>
          <p className="text-sm text-muted-foreground">Conoce más</p>
        </CardHeader>
        <CardContent>
          {/* Para pantallas grandes */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-gray-700">ID</TableHead>
                  <TableHead className="text-gray-700">Usuario</TableHead>
                  <TableHead className="text-gray-700">Correo</TableHead>
                  <TableHead className="text-gray-700">Rol</TableHead>
                  <TableHead className="text-gray-700">Fecha de creación</TableHead>
                  <TableHead className="text-gray-700 text-right">Acciones</TableHead> {/* Alineado a la derecha */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow
                    key={usuario.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>{usuario.id}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {usuario.name}
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          usuario.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {usuario.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(usuario.createdAt).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right"> {/* Alineado a la derecha */}
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(usuario.id)}
                          className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                          onClick={() => handleDelete(usuario.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Para pantallas pequeñas */}
          <div className="md:hidden space-y-4">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{usuario.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {usuario.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>ID:</strong> {usuario.id}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Correo:</strong> {usuario.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Creado:</strong>{' '}
                  {new Date(usuario.createdAt).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <div className="flex space-x-2 justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(usuario.id)}
                    className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
