import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Search, Filter } from "lucide-react";
import { userService } from "@/services/api";
import { EditUserModal } from "./EditUserModal";

interface Usuario {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export const UsuariosPanel = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setEditOpen] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await userService.getAllUsers();
        setUsuarios(usersData.users || []);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Función para editar un usuario
  const handleEdit = async (id: number) => {
    try {
      const user = await userService.getUserById(id);
      setSelectedUser(user.user);
      setEditOpen(true);
    } catch (error) {
      console.error("Error getting user:", error);
      alert("Error al obtener datos del usuario");
    }
  };

  // Función para eliminar un usuario
  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (!isConfirmed) return;

    try {
      await userService.deleteUser(id);
      setUsuarios((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert(`Usuario con ID: ${id} eliminado exitosamente.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error al eliminar el usuario");
    }
  };

  // Filtrar usuarios
  const filteredUsers = usuarios.filter((user) => {
    const nameMatch =
      user.name.toLowerCase().includes(filterName.toLowerCase()) ||
      user.email.toLowerCase().includes(filterName.toLowerCase());
    const roleMatch = filterRole === "" || user.role === filterRole;

    return nameMatch && roleMatch;
  });

  const clearFilters = () => {
    setFilterName("");
    setFilterRole("");
  };

  if (loading) {
    return (
      <div className="p-1 md:p-1">
        <Card className="shadow-md border">
          <CardContent className="p-8">
            <div className="text-center">
              <p>Cargando usuarios...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-1 md:p-1">
        <Card className="shadow-md border">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-1 md:p-1">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Nuestros Usuarios
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gestiona los usuarios de la plataforma
          </p>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o email..."
                className="pl-10"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Ocultar Filtros" : "Filtros"}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="border rounded px-3 py-2 text-sm"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <Button variant="ghost" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          )}
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
                  <TableHead className="text-gray-700">
                    Fecha de creación
                  </TableHead>
                  <TableHead className="text-gray-700 text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((usuario) => (
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
                          usuario.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {usuario.role === "admin" ? "Admin" : "User"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(usuario.createdAt).toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        
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
            {filteredUsers.map((usuario) => (
              <div
                key={usuario.id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {usuario.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {usuario.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>ID:</strong> {usuario.id}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Correo:</strong> {usuario.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Creado:</strong>{" "}
                  {new Date(usuario.createdAt).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="flex space-x-2 justify-end mt-2">
                  
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron usuarios</p>
            </div>
          )}
        </CardContent>
      </Card>
      {isEditOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setEditOpen(false)}
          onUpdate={(updatedUser) => {
            setUsuarios((prev) =>
              prev.map((u) =>
                u.id === updatedUser.id ? { ...u, ...updatedUser } : u
              )
            );
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
};
