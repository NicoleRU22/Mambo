// src/components/admin/AdminBlogList.tsx

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  category: string;
}

export const AdminBlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/blog");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      toast.error("Error al obtener artículos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      toast.success("Artículo eliminado");
      fetchPosts();
    } catch (err) {
      toast.error("No se pudo eliminar el artículo");
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Lista de Artículos</h2>
      {loading ? (
        <p>Cargando artículos...</p>
      ) : posts.length === 0 ? (
        <p>No hay artículos publicados aún.</p>
      ) : (
        <table className="w-full table-auto border text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Título</th>
              <th className="p-2">Categoría</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="p-2 font-semibold">{post.title}</td>
                <td className="p-2">{post.category}</td>
                <td className="p-2">{new Date(post.date).toLocaleDateString()}</td>
                <td className="p-2 space-x-2">
                  <Button variant="secondary" onClick={() => alert("Editar ID " + post.id)}>
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
