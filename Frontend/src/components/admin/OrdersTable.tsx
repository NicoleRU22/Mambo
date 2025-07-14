import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { orderService } from "@/services/api";
import { ViewProductModal } from "./ViewProductModal";

interface Order {
  id: number;
  orderNumber: string; // coincide con el backend
  customer_name: string;
  customer_email: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemCount?: number; // ojo, “itemCount” no “items_count”
}

export const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [minRange, setMinRange] = useState(0);
  const [maxRange, setMaxRange] = useState(150);
  // Para el modal de detalles
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Cargar pedidos
  useEffect(() => {
    console.log("🏷️ OrdersTable montado, pidiendo datos…");
    const loadOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        console.log("✅ data recibida:", data);
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Error al cargar los pedidos");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  // … dentro de tu componente OrdersTable …
  const filteredOrders = orders.filter((order) => {
    const nameMatch = normalizeText(
      order.customer_name + order.customer_email
    ).includes(normalizeText(filterName));

    const statusMatch = filterStatus === "" || order.status === filterStatus;

    const dateMatch =
      filterDate === "" || order.createdAt.startsWith(filterDate);

    const priceMatch =
      order.totalAmount >= minRange && order.totalAmount <= maxRange;

    return nameMatch && statusMatch && dateMatch && priceMatch;
  });

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);

      // Actualizar la lista local
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error al actualizar el estado del pedido");
    }
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterStatus("");
    setFilterDate("");
    setMinRange(0);
    setMaxRange(150);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      completed: "bg-green-500",
      shipped: "bg-blue-500",
      processing: "bg-yellow-500",
      pending: "bg-orange-500",
      cancelled: "bg-red-500",
    };
    return (
      <Badge className={statusStyles[status] || "bg-gray-500"}>{status}</Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    const statusIcons: Record<string, React.ReactNode> = {
      completed: <Check className="h-4 w-4" />,
      shipped: <Send className="h-4 w-4" />,
      processing: <PackageCheck className="h-4 w-4" />,
      pending: <Clock className="h-4 w-4" />,
      cancelled: <Ban className="h-4 w-4" />,
    };
    return statusIcons[status] || <Clock className="h-4 w-4" />;
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Pedidos");

    // Establecer anchos manualmente
    sheet.columns = [
      { key: "order_number", width: 12 },
      { key: "customer_name", width: 25 },
      { key: "customer_email", width: 30 },
      { key: "created_at", width: 15 },
      { key: "total_amount", width: 15 },
      { key: "status", width: 15 },
      { key: "items_count", width: 10 },
    ];

    // Título
    sheet.mergeCells("A1", "G1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = "Gestión de pedidos";
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Encabezado (en la fila 3)
    const headers = [
      "Pedido",
      "Cliente",
      "Correo",
      "Fecha",
      "Total",
      "Estado",
      "Items",
    ];
    const headerRow = sheet.getRow(3);
    headerRow.values = headers;
    headerRow.height = 20;

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "305496" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Colores por estado
    const statusColorMap: Record<string, string> = {
      completed: "C6EFCE",
      shipped: "D9E1F2",
      processing: "FFF2CC",
      pending: "FCE4D6",
      cancelled: "F8CBAD",
    };

    // Insertar datos a partir de fila 4
    filteredOrders.forEach((order, index) => {
      const rowIndex = 4 + index;
      const row = sheet.getRow(rowIndex);

      row.values = [
        order.orderNumber,
        order.customer_name,
        order.customer_email,
        // Date: puedes formatearla como necesites
        new Date(order.createdAt).toISOString().slice(0, 10),
        order.totalAmount,
        order.status,
        order.itemCount,
      ];
      const color = statusColorMap[order.status] || "FFFFFF";

      row.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: color },
        };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        if (colNumber === 5) {
          cell.numFmt = '"S/."#,##0.00';
        }
        if (colNumber === 4) {
          cell.numFmt = "yyyy-mm-dd";
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Gestion_de_Pedidos.xlsx");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p>Cargando pedidos...</p>
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
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Pedidos</CardTitle>
        <div className="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por cliente o email..."
              className="pl-10"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Ocultar Filtros" : "Filtros"}
          </Button>
          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <Input
              type="date"
              placeholder="Filtrar por fecha"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Precio mínimo"
              value={minRange}
              onChange={(e) => setMinRange(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Precio máximo"
              value={maxRange}
              onChange={(e) => setMaxRange(Number(e.target.value))}
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {order.customer_email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="font-medium">
                  S/.{order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    {getStatusBadge(order.status)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>

                      {order.status === "pending" && (
                        <DropdownMenuItem
                          onClick={() => updateStatus(order.id, "processing")}
                        >
                          <PackageCheck className="h-4 w-4 mr-2" />
                          Procesar
                        </DropdownMenuItem>
                      )}
                      {order.status === "processing" && (
                        <DropdownMenuItem
                          onClick={() => updateStatus(order.id, "shipped")}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar
                        </DropdownMenuItem>
                      )}
                      {order.status === "shipped" && (
                        <DropdownMenuItem
                          onClick={() => updateStatus(order.id, "completed")}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Completar
                        </DropdownMenuItem>
                      )}
                      {order.status !== "completed" &&
                        order.status !== "cancelled" && (
                          <DropdownMenuItem
                            onClick={() => updateStatus(order.id, "cancelled")}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron pedidos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
