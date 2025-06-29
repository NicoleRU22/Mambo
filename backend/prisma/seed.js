// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("\n🟢 Ejecutando seed.js...\n");

  // 1) Crear el usuario admin con el rol "ADMIN"
  const adminEmail = "admin@gmail.com";
  const plainAdminPassword = "adminm@mbo";
  const hashedAdminPassword = await bcrypt.hash(plainAdminPassword, 10); // Encriptar la contraseña

  // → Buscar si el usuario ya existe
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    // No existe: lo creamos
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedAdminPassword, // Contraseña encriptada
        role: 'ADMIN', // Asignar rol ADMIN
        name: "Administrador"
      },
    });
    console.log(`   · Usuario ADMIN creado (email="${adminEmail}", id="${adminUser.id}").`);
  } else {
    console.log(`   · Ya existía usuario con email="${adminEmail}". (id=${adminUser.id})`);
  }

  // 2) Verificar estadísticas después de la creación
  const totalUsers = await prisma.user.count();
  const totalAdmins = await prisma.user.count({
    where: { role: 'ADMIN' },
  });

  console.log("\n✅ Seed finalizado con éxito:");
  console.log(`   • Total de usuarios:    ${totalUsers}`);
  console.log(`   • Total de administradores (role='ADMIN'): ${totalAdmins}`);
  console.log("\n   · Puedes iniciar sesión con admin@gmail.com / adminm@mbo\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Error durante seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });