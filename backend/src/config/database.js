// src/config/database.js
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const query = async (model, operation, data = {}) => {
  if (!prisma[model]) {
    throw new Error(`Modelo '${model}' no existe en Prisma`);
  }
  if (!prisma[model][operation]) {
    throw new Error(
      `Operación '${operation}' no válida para el modelo '${model}'`
    );
  }

  try {
    return await prisma[model][operation](data);
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export const getConnection = async () => prisma;
export const closeConnection = async () => await prisma.$disconnect();
export const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export { prisma };
