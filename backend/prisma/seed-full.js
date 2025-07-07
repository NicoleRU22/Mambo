import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("\n🟢 Ejecutando seed-full.js...\n");

  // 1) Crear el usuario admin con el rol "ADMIN"
  const adminEmail = "admin@gmail.com";
  const plainAdminPassword = "adminm@mbo";
  const hashedAdminPassword = await bcrypt.hash(plainAdminPassword, 10);

  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedAdminPassword,
        role: "ADMIN",
        name: "Administrador",
      },
    });
    console.log(
      `   · Usuario ADMIN creado (email="${adminEmail}", id="${adminUser.id}").`
    );
  } else {
    console.log(
      `   · Ya existía usuario con email="${adminEmail}". (id=${adminUser.id})`
    );
  }

  // 2) Categorías
  const categoriesData = [
    { name: "Ropa", description: "Prendas para mascotas" },
    { name: "Alimento", description: "Comida y snacks" },
    { name: "Juguetes", description: "Juguetes interactivos" },
    { name: "Accesorios", description: "Collares, camas, etc." },
    { name: "Higiene", description: "Shampoo, cepillos, toallas" },
    { name: "Salud", description: "Vitaminas, antipulgas, medicamentos" },
    { name: "Transportadoras", description: "Jaulas, mochilas, bolsos" },
    { name: "Rascadores", description: "Rascadores y árboles para gatos" },
    { name: "Peceras", description: "Peceras y accesorios" },
    { name: "Jaulas", description: "Jaulas y accesorios" },
    { name: "Camas", description: "Camas y colchones" },
    { name: "Comederos", description: "Platos y bebederos" },
    {
      name: "Ropa de temporada",
      description: "Disfraces, abrigos, impermeables",
    },
  ];

  // Insertar categorías si no existen
  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { name: cat.name }, // <- dinámico según categoría
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
      },
    });
  }

  console.log(`   · Categorías insertadas: ${categoriesData.length}`);

  // 3) Productos de ejemplo
  const allCategories = await prisma.category.findMany();
  const getCategoryId = (name) =>
    allCategories.find((c) => c.name === name)?.id;

  const productsData = [
    // Ropa
    {
      name: "Suéter Cozy Winter",
      description: "Suéter abrigado para perros",
      price: 24.99,
      originalPrice: 34.99,
      stock: 50,
      petType: "DOG",
      images: ["https://i.imgur.com/1.jpg"],
      sizes: ["XS", "S", "M", "L"],
      category: "Ropa",
    },
    {
      name: "Vestido Princesa",
      description: "Vestido elegante para perras",
      price: 32.99,
      originalPrice: null,
      stock: 30,
      petType: "DOG",
      images: ["https://i.imgur.com/2.jpg"],
      sizes: ["XS", "S", "M"],
      category: "Ropa",
    },
    {
      name: "Chaleco Gato",
      description: "Chaleco para gatos",
      price: 22.99,
      originalPrice: null,
      stock: 40,
      petType: "CAT",
      images: ["https://i.imgur.com/3.jpg"],
      sizes: ["XS", "S", "M"],
      category: "Ropa",
    },
    // Alimento
    {
      name: "Croquetas Premium",
      description: "Alimento seco para perros",
      price: 49.99,
      originalPrice: 59.99,
      stock: 100,
      petType: "DOG",
      images: ["https://i.imgur.com/4.jpg"],
      sizes: [],
      category: "Alimento",
    },
    {
      name: "Snack Dental",
      description: "Snack para limpieza dental",
      price: 9.99,
      originalPrice: null,
      stock: 80,
      petType: "DOG",
      images: ["https://i.imgur.com/5.jpg"],
      sizes: [],
      category: "Alimento",
    },
    {
      name: "Alimento Gato",
      description: "Alimento húmedo para gatos",
      price: 19.99,
      originalPrice: 24.99,
      stock: 60,
      petType: "CAT",
      images: ["https://i.imgur.com/6.jpg"],
      sizes: [],
      category: "Alimento",
    },
    {
      name: "Semillas para aves",
      description: "Alimento para aves",
      price: 7.99,
      originalPrice: null,
      stock: 40,
      petType: "BIRD",
      images: ["https://i.imgur.com/7.jpg"],
      sizes: [],
      category: "Alimento",
    },
    {
      name: "Comida para peces",
      description: "Alimento en escamas",
      price: 5.99,
      originalPrice: null,
      stock: 50,
      petType: "FISH",
      images: ["https://i.imgur.com/8.jpg"],
      sizes: [],
      category: "Alimento",
    },
    // Juguetes
    {
      name: "Pelota Saltarina",
      description: "Pelota para perros",
      price: 12.99,
      originalPrice: null,
      stock: 70,
      petType: "DOG",
      images: ["https://i.imgur.com/9.jpg"],
      sizes: [],
      category: "Juguetes",
    },
    {
      name: "Ratón de peluche",
      description: "Juguete para gatos",
      price: 8.99,
      originalPrice: null,
      stock: 60,
      petType: "CAT",
      images: ["https://i.imgur.com/10.jpg"],
      sizes: [],
      category: "Juguetes",
    },
    {
      name: "Columpio para aves",
      description: "Juguete para aves",
      price: 14.99,
      originalPrice: null,
      stock: 30,
      petType: "BIRD",
      images: ["https://i.imgur.com/11.jpg"],
      sizes: [],
      category: "Juguetes",
    },
    // Accesorios
    {
      name: "Collar Reflectante",
      description: "Collar para perros",
      price: 15.99,
      originalPrice: 19.99,
      stock: 90,
      petType: "DOG",
      images: ["https://i.imgur.com/12.jpg"],
      sizes: [],
      category: "Accesorios",
    },
    {
      name: "Cama Suave",
      description: "Cama para gatos",
      price: 29.99,
      originalPrice: 39.99,
      stock: 40,
      petType: "CAT",
      images: ["https://i.imgur.com/13.jpg"],
      sizes: [],
      category: "Camas",
    },
    // Higiene
    {
      name: "Shampoo Antipulgas",
      description: "Shampoo para perros",
      price: 18.99,
      originalPrice: null,
      stock: 30,
      petType: "DOG",
      images: ["https://i.imgur.com/14.jpg"],
      sizes: [],
      category: "Higiene",
    },
    {
      name: "Cepillo Dental",
      description: "Cepillo para gatos",
      price: 6.99,
      originalPrice: null,
      stock: 50,
      petType: "CAT",
      images: ["https://i.imgur.com/15.jpg"],
      sizes: [],
      category: "Higiene",
    },
    // Salud
    {
      name: "Vitaminas",
      description: "Vitaminas para aves",
      price: 11.99,
      originalPrice: null,
      stock: 20,
      petType: "BIRD",
      images: ["https://i.imgur.com/16.jpg"],
      sizes: [],
      category: "Salud",
    },
    // Transportadoras
    {
      name: "Transportadora Mediana",
      description: "Transportadora para perros",
      price: 49.99,
      originalPrice: 59.99,
      stock: 15,
      petType: "DOG",
      images: ["https://i.imgur.com/17.jpg"],
      sizes: [],
      category: "Transportadoras",
    },
    // Rascadores
    {
      name: "Rascador Deluxe",
      description: "Rascador para gatos",
      price: 39.99,
      originalPrice: 49.99,
      stock: 10,
      petType: "CAT",
      images: ["https://i.imgur.com/18.jpg"],
      sizes: [],
      category: "Rascadores",
    },
    // Peceras
    {
      name: "Pecera 20L",
      description: "Pecera para peces",
      price: 59.99,
      originalPrice: null,
      stock: 8,
      petType: "FISH",
      images: ["https://i.imgur.com/19.jpg"],
      sizes: [],
      category: "Peceras",
    },
    // Jaulas
    {
      name: "Jaula Grande",
      description: "Jaula para aves",
      price: 44.99,
      originalPrice: null,
      stock: 12,
      petType: "BIRD",
      images: ["https://i.imgur.com/20.jpg"],
      sizes: [],
      category: "Jaulas",
    },
    // Comederos
    {
      name: "Comedero Antideslizante",
      description: "Comedero para perros",
      price: 9.99,
      originalPrice: null,
      stock: 60,
      petType: "DOG",
      images: ["https://i.imgur.com/21.jpg"],
      sizes: [],
      category: "Comederos",
    },
    // Ropa de temporada
    {
      name: "Disfraz de Halloween",
      description: "Disfraz para gatos",
      price: 19.99,
      originalPrice: null,
      stock: 20,
      petType: "CAT",
      images: ["https://i.imgur.com/22.jpg"],
      sizes: ["S", "M"],
      category: "Ropa de temporada",
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { name: prod.name },
      update: {},
      create: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice,
        stock: prod.stock,
        petType: prod.petType,
        images: prod.images,
        sizes: prod.sizes,
        categoryId: getCategoryId(prod.category),
      },
    });
  }
  console.log(`   · Productos insertados: ${productsData.length}`);

  console.log("\n✅ Seed de categorías y productos finalizado con éxito.\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Error durante seed-full:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
