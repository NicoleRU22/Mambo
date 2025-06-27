const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Crear instancia de Prisma
const prisma = new PrismaClient();

// Función para probar la conexión
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Función para ejecutar queries (usando Prisma)
const query = async (model, operation, data = {}) => {
  try {
    return await prisma[model][operation](data);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Función para obtener una conexión (no necesaria con Prisma, pero mantenemos la interfaz)
const getConnection = async () => {
  return prisma;
};

// Función para cerrar la conexión
const closeConnection = async () => {
  await prisma.$disconnect();
};

module.exports = {
  prisma,
  query,
  getConnection,
  testConnection,
  closeConnection
<<<<<<<<< Temporary merge branch 1
};
=========
}; 
>>>>>>>>> Temporary merge branch 2
