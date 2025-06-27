import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Eye,
  Download,
  MoreHorizontal,
  Check,
  Send,
  PackageCheck,
  Ban,
  Clock,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: string; // Ej: "S/.67.50"
  status: string;
  items: number;
};

export const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#1234',
      customer: 'María González',
      email: 'maria@email.com',
      date: '2024-01-15',
      total: 'S/.67.50',
      status: 'Completado',
      items: 3,
    },
    {
      id: '#1235',
      customer: 'Carlos Ruiz',
      email: 'carlos@email.com',
      date: '2024-01-15',
      total: 'S/.45.99',
      status: 'Enviado',
      items: 2,
    },
    {
      id: '#1236',
      customer: 'Ana Martínez',
      email: 'ana@email.com',
      date: '2024-01-14',
      total: 'S/.123.75',
      status: 'Procesando',
      items: 5,
    },
    {
      id: '#1237',
      customer: 'Luis Herrera',
      email: 'luis@email.com',
      date: '2024-01-14',
      total: 'S/.89.25',
      status: 'Pendiente',
      items: 4,
    },
    {
      id: '#1238',
      customer: 'Sofia López',
      email: 'sofia@email.com',
      date: '2024-01-13',
      total: 'S/.34.50',
      status: 'Cancelado',
      items: 1,
    },
  ]);

  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [minRange, setMinRange] = useState(0);
  const [maxRange, setMaxRange] = useState(150);

  const normalizeText = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const parsePrice = (price: string): number =>
    parseFloat(price.replace('S/.', '').trim());

  const filteredOrders = orders.filter((order) => {
    const nameMatch = normalizeText(order.customer + order.email).includes(normalizeText(filterName));
    const statusMatch = filterStatus === '' || order.status === filterStatus;
    const dateMatch = filterDate === '' || order.date === filterDate;
    const price = parsePrice(order.total);
    const priceMatch = price >= minRange && price <= maxRange;

    return nameMatch && statusMatch && dateMatch && priceMatch;
  });

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const clearFilters = () => {
    setFilterName('');
    setFilterStatus('');
    setFilterDate('');
    setMinRange(0);
    setMaxRange(150);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      Completado: 'bg-green-500',
      Enviado: 'bg-blue-500',
      Procesando: 'bg-yellow-500',
      Pendiente: 'bg-orange-500',
      Cancelado: 'bg-red-500',
    };
    return <Badge className={statusStyles[status] || 'bg-gray-500'}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Pedidos</CardTitle>

        <div className="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar cliente o correo..."
              className="pl-10"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Ocultar filtros' : 'Filtros'}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end">
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="Completado">Completado</option>
              <option value="Enviado">Enviado</option>
              <option value="Procesando">Procesando</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-sm"
            />

            {/* Rango de precio */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm">Rango de precios: S/.{minRange} - S/.{maxRange}</label>
              <div className="flex space-x-2">
                <input
                  type="range"
                  min={0}
                  max={150}
                  value={minRange}
                  onChange={(e) => setMinRange(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="range"
                  min={0}
                  max={150}
                  value={maxRange}
                  onChange={(e) => setMaxRange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <Button variant="ghost" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-500 mb-3">
          {filteredOrders.length} pedido(s) encontrados
        </p>

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
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.email}</p>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items} items</TableCell>
                <TableCell className="font-medium">{order.total}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert('Ver detalles')}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'Procesando')}>
                        <Check className="h-4 w-4 mr-2" />
                        Procesando
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'Enviado')}>
                        <Send className="h-4 w-4 mr-2" />
                        Enviado
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'Completado')}>
                        <PackageCheck className="h-4 w-4 mr-2" />
                        Entregado
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'Pendiente')}>
                        <Clock className="h-4 w-4 mr-2" />
                        Pendiente
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => updateStatus(order.id, 'Cancelado')}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Cancelado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
