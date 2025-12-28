import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123456", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: adminPassword,
      name: "Admin User",
      role: "ADMIN",
      isEmailVerified: true,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create test user
  const userPassword = await bcrypt.hash("user123456", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      passwordHash: userPassword,
      name: "Test User",
      role: "USER",
      isEmailVerified: true,
    },
  });
  console.log("✅ Test user created:", user.email);

  // Create categories
  const categories = [
    {
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and accessories",
    },
    { name: "Clothing", slug: "clothing", description: "Fashion and apparel" },
    {
      name: "Home & Garden",
      slug: "home-garden",
      description: "Home and garden products",
    },
    { name: "Books", slug: "books", description: "Books and literature" },
    {
      name: "Sports",
      slug: "sports",
      description: "Sports equipment and gear",
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(created);
  }
  console.log(`✅ Created ${createdCategories.length} categories`);

  // Create sample products
  const products = [
    {
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "High-quality wireless headphones with noise cancellation",
      shortDesc: "Premium wireless headphones",
      price: 99.99,
      comparePrice: 129.99,
      stock: 50,
      categoryId: createdCategories[0].id,
      isFeatured: true,
      images: ["/uploads/images/placeholder-headphones.jpg"],
    },
    {
      name: "Cotton T-Shirt",
      slug: "cotton-t-shirt",
      description: "100% cotton comfortable t-shirt",
      shortDesc: "Comfortable cotton t-shirt",
      price: 19.99,
      comparePrice: 29.99,
      stock: 100,
      categoryId: createdCategories[1].id,
      isFeatured: true,
      images: ["/uploads/images/placeholder-tshirt.jpg"],
    },
    {
      name: "Smart Watch",
      slug: "smart-watch",
      description: "Feature-rich smartwatch with fitness tracking",
      shortDesc: "Smart fitness watch",
      price: 199.99,
      comparePrice: 249.99,
      stock: 30,
      categoryId: createdCategories[0].id,
      isFeatured: true,
      images: ["/uploads/images/placeholder-watch.jpg"],
    },
    {
      name: "Yoga Mat",
      slug: "yoga-mat",
      description: "Non-slip yoga mat for all fitness levels",
      shortDesc: "Premium yoga mat",
      price: 29.99,
      stock: 75,
      categoryId: createdCategories[4].id,
      images: ["/uploads/images/placeholder-yoga.jpg"],
    },
    {
      name: "Coffee Maker",
      slug: "coffee-maker",
      description: "Automatic coffee maker with timer",
      shortDesc: "Programmable coffee maker",
      price: 79.99,
      comparePrice: 99.99,
      stock: 40,
      categoryId: createdCategories[2].id,
      images: ["/uploads/images/placeholder-coffee.jpg"],
    },
    {
      name: "Running Shoes",
      slug: "running-shoes",
      description: "Comfortable running shoes with cushioned sole",
      shortDesc: "Professional running shoes",
      price: 89.99,
      stock: 60,
      categoryId: createdCategories[4].id,
      isFeatured: true,
      images: ["/uploads/images/placeholder-shoes.jpg"],
    },
    {
      name: "Bestseller Novel",
      slug: "bestseller-novel",
      description: "Award-winning fiction bestseller",
      shortDesc: "Bestselling fiction book",
      price: 14.99,
      stock: 100,
      categoryId: createdCategories[3].id,
      images: ["/uploads/images/placeholder-book.jpg"],
    },
    {
      name: "Desk Lamp",
      slug: "desk-lamp",
      description: "Adjustable LED desk lamp",
      shortDesc: "LED desk lamp",
      price: 34.99,
      stock: 45,
      categoryId: createdCategories[2].id,
      images: ["/uploads/images/placeholder-lamp.jpg"],
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        images: product.images,
        name: product.name,
        description: product.description,
        shortDesc: product.shortDesc,
        price: product.price,
        comparePrice: product.comparePrice,
        stock: product.stock,
        isFeatured: product.isFeatured,
      },
      create: product,
    });
    createdProducts.push(created);
  }
  console.log(`✅ Created ${createdProducts.length} products`);

  // Create sample reviews
  const reviews = [
    {
      productId: createdProducts[0].id,
      userId: user.id,
      rating: 5,
      title: "Excellent sound quality",
      comment: "Best headphones I have ever owned. Highly recommended!",
    },
    {
      productId: createdProducts[1].id,
      userId: user.id,
      rating: 4,
      title: "Very comfortable",
      comment: "Great t-shirt, fits perfectly.",
    },
    {
      productId: createdProducts[2].id,
      userId: user.id,
      rating: 5,
      title: "Amazing smartwatch",
      comment: "All features work perfectly. Battery lasts for days!",
    },
  ];

  for (const review of reviews) {
    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: review.productId,
          userId: review.userId,
        },
      },
      update: {},
      create: review,
    });
  }
  console.log(`✅ Created ${reviews.length} reviews`);

  console.log("🎉 Database seeded successfully!");
  console.log("\n📝 Test credentials:");
  console.log("Admin: admin@example.com / admin123456");
  console.log("User: user@example.com / user123456");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
