
import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { ProductsTable } from './ProductsTable';
import { AdminBlog } from './AdminBlog'; // ← importar el nuevo componente

export const AdminLayout = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');

  return (
    <div className="flex">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 p-6 overflow-auto">
        {activeSection === 'Dashboard' && <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>}
        {activeSection === 'Productos' && <ProductsTable />}
        {activeSection === 'Blog' && <AdminBlog />} {/* ← muestra el contenido del blog */}
      </div>
    </div>
  );
};
