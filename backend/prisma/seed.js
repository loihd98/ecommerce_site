import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("��� Starting database seed...");

  // Determine environment
  const isDev = process.env.NODE_ENV === "development";

  // Create admin user only
  const adminPassword = await bcrypt.hash("admin123456", 10);
  const admin = await prisma.user.upsert({
    where: { email: isDev ? "admin@example.com" : "admin@taphoanhadev.com" },
    update: {},
    create: {
      email: isDev ? "admin@example.com" : "admin@taphoanhadev.com",
      passwordHash: adminPassword,
      name: "Admin User",
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  console.log("✅ Admin user created successfully!");
  console.log("��� Email:", admin.email);
  console.log("��� Password: admin123456");
  console.log("��� Role:", admin.role);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
