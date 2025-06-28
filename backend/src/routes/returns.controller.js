// 📁 backend/controllers/returns.controller.ts
import prisma from "../lib/prisma";
import { Request, Response } from "express";

export const createReturnRequest = async (req, res) => {
  const { userId, orderItemId, reason } = req.body;
  try {
    const request = await prisma.returnRequest.create({
      data: { userId, orderItemId, reason },
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: "Error creando devolución" });
  }
};

export const getAllReturns = async (_req, res) => {
  const requests = await prisma.returnRequest.findMany();
  res.json(requests);
};

export const getReturnById = async (req, res) => {
  const { id } = req.params;
  const request = await prisma.returnRequest.findUnique({ where: { id } });
  request
    ? res.json(request)
    : res.status(404).json({ error: "No encontrada" });
};

export const updateReturnStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await prisma.returnRequest.update({
    where: { id },
    data: { status },
  });
  res.json(updated);
};

export const deleteReturnRequest = async (req, res) => {
  const { id } = req.params;
  await prisma.returnRequest.delete({ where: { id } });
  res.status(204).send();
};
