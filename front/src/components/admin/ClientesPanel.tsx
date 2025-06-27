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

interface Cliente {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export const ClientesPanel = () => {
  const clientes: Cliente[] = [
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

  return (
    <div className="p-4 md:p-6">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Nuestros clientes
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow
                    key={cliente.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>{cliente.id}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {cliente.name}
                    </TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          cliente.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {cliente.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(cliente.createdAt).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Para pantallas pequeñas */}
          <div className="md:hidden space-y-4">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{cliente.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      cliente.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {cliente.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>ID:</strong> {cliente.id}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Correo:</strong> {cliente.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Creado:</strong>{' '}
                  {new Date(cliente.createdAt).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
