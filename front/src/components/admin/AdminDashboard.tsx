import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { AdminBlog } from "@/components/admin/AdminBlog";
import AdminContact from "@/components/admin/AdminContact";
import { UsuariosPanel } from "@/components/admin/UsuariosPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import AdminProfilePanel from "./AdminProfilePanel";
import { orderService, userService, productService } from "@/services/api";
import AdminSettingsPanel from "./AdminSettingsPanel";

interface DashboardStats {
  total_orders: number;
  total_sales: string;
  monthly_orders: number;
  monthly_sales: string;
  orders_by_status: Array<{ status: string; count: number }>;
}

interface UserStats {
  summary: {
    total_users: number;
    monthly_users: number;
  };
  users_by_role: Array<{ role: string; count: number }>;
}

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStats, setOrderStats] = useState<DashboardStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [productCount, setProductCount] = useState(0);

  // Cargar estadísticas del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [ordersRes, usersRes, productsRes] = await Promise.allSettled([
          orderService.getOrderStats(),
          userService.getUserStats(),
          productService.getCount(),
        ]);

        if (ordersRes.status === "fulfilled") {
          setOrderStats(ordersRes.value);
        }

        if (usersRes.status === "fulfilled") {
          setUserStats(usersRes.value);
        }

        if (productsRes.status === "fulfilled") {
          setProductCount(productsRes.value.count);
        }

        // Si todas fallan, muestra error
        if (
          ordersRes.status === "rejected" &&
          usersRes.status === "rejected" &&
          productsRes.status === "rejected"
        ) {
          throw new Error("Todos los servicios fallaron");
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Datos de ventas mensuales (ejemplo - en producción vendrían de la API)
  const salesData = [
    { name: "Ene", ventas: 4000, pedidos: 240 },
    { name: "Feb", ventas: 3000, pedidos: 139 },
    { name: "Mar", ventas: 2000, pedidos: 980 },
    { name: "Abr", ventas: 2780, pedidos: 390 },
    { name: "May", ventas: 1890, pedidos: 480 },
    { name: "Jun", ventas: 2390, pedidos: 380 },
  ];

  // Datos de categorías (ejemplo - en producción vendrían de la API)
  const categoryData = [
    { name: "Ropas", value: 400, color: "#8B5CF6" },
    { name: "Juguetes", value: 300, color: "#06B6D4" },
    { name: "Alimento", value: 200, color: "#10B981" },
    { name: "Accesorios", value: 100, color: "#F59E0B" },
  ];

  // Estadísticas dinámicas basadas en datos reales
  const stats = [
    {
      title: "Usuarios",
      value: userStats ? userStats.summary.total_users.toString() : "0",
      change: "+12%",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  const topProducts = [
    { name: "Collar Premium para Perros", sales: 156, revenue: "$2,340" },
    { name: "Comida Gourmet Gatos", sales: 142, revenue: "$2,130" },
    { name: "Juguete Interactivo", sales: 98, revenue: "$1,470" },
    { name: "Arena Sanitaria", sales: 87, revenue: "$1,305" },
  ];

  const recentActivity = [
    {
      action: "Nuevo pedido #1234",
      time: "Hace 2 minutos",
      icon: ShoppingCart,
    },
    {
      action: 'Producto "Collar Premium" actualizado',
      time: "Hace 15 minutos",
      icon: Package,
    },
    {
      action: "Stock bajo: Comida para gatos",
      time: "Hace 1 hora",
      icon: AlertTriangle,
    },
    { action: "Nuevo cliente registrado", time: "Hace 2 horas", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div className="flex-1 p-8 overflow-auto">
          <div className="text-center">
            <p>Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div className="flex-1 p-8 overflow-auto">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="flex-1 p-8 overflow-auto">
        {activeSection === "Dashboard" && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 mb-6">
              Gestiona tu tienda de mascotas desde aquí
            </p>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="products">Productos</TabsTrigger>
                <TabsTrigger value="orders">Pedidos</TabsTrigger>
                <TabsTrigger value="analytics">Analíticas</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                          {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className={stat.color}>{stat.change}</span>{" "}
                          desde el mes pasado
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ventas Mensuales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="ventas" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ventas por Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <item.icon className="h-4 w-4 text-gray-500" />
                          <div className="flex-1">
                            <p className="text-sm">{item.action}</p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products">
                <ProductsTable />
              </TabsContent>

              <TabsContent value="orders">
                <OrdersTable />
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tendencia de Ventas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="ventas"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Productos Más Vendidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topProducts.map((product, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.sales} ventas
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {product.revenue}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {activeSection === "Productos" && <ProductsTable />}
        {activeSection === "Pedidos" && <OrdersTable />}
        {activeSection === "Usuarios" && <UsuariosPanel />}
        {activeSection === "Blog" && <AdminBlog />}
        {activeSection === "Contacto" && <AdminContact />}
        {activeSection === "Perfil" && <AdminProfilePanel />}
        {activeSection === "Configuración" && <AdminSettingsPanel />}

      </div>
    </div>
  );
};

export default AdminDashboard;