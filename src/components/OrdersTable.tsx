
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
import { Search, Eye, Download } from 'lucide-react';

export const OrdersTable = () => {
  const orders = [
    {
      id: '#1234',
      customer: 'María González',
      email: 'maria@email.com',
      date: '2024-01-15',
      total: 'S/.67.50',
      status: 'Completado',
      items: 3
    },
    {
      id: '#1235',
      customer: 'Carlos Ruiz',
      email: 'carlos@email.com',
      date: '2024-01-15',
      total: 'S/.45.99',
      status: 'Enviado',
      items: 2
    },
    {
      id: '#1236',
      customer: 'Ana Martínez',
      email: 'ana@email.com',
      date: '2024-01-14',
      total: 'S/.123.75',
      status: 'Procesando',
      items: 5
    },
    {
      id: '#1237',
      customer: 'Luis Herrera',
      email: 'luis@email.com',
      date: '2024-01-14',
      total: 'S/.89.25',
      status: 'Pendiente',
      items: 4
    },
    {
      id: '#1238',
      customer: 'Sofia López',
      email: 'sofia@email.com',
      date: '2024-01-13',
      total: 'S/.34.50',
      status: 'Cancelado',
      items: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Completado': 'bg-green-500',
      'Enviado': 'bg-blue-500',
      'Procesando': 'bg-yellow-500',
      'Pendiente': 'bg-orange-500',
      'Cancelado': 'bg-red-500'
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestión de Pedidos</CardTitle>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Buscar pedidos..." className="pl-10" />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items} items</TableCell>
                <TableCell className="font-medium">{order.total}</TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      Gestionar
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
