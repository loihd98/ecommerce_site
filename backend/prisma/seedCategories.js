import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('🌱 Seeding categories...');

  // Create parent categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      isActive: true,
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing and accessories',
      isActive: true,
    },
  });

  const home = await prisma.category.upsert({
    where: { slug: 'home-living' },
    update: {},
    create: {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Home decor and furniture',
      isActive: true,
    },
  });

  const beauty = await prisma.category.upsert({
    where: { slug: 'beauty' },
    update: {},
    create: {
      name: 'Beauty',
      slug: 'beauty',
      description: 'Beauty and personal care products',
      isActive: true,
    },
  });

  const sports = await prisma.category.upsert({
    where: { slug: 'sports' },
    update: {},
    create: {
      name: 'Sports & Outdoors',
      slug: 'sports',
      description: 'Sports equipment and outdoor gear',
      isActive: true,
    },
  });

  // Create subcategories
  await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      parentId: electronics.id,
      isActive: true,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptops and notebooks',
      parentId: electronics.id,
      isActive: true,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'mens-fashion' },
    update: {},
    create: {
      name: "Men's Fashion",
      slug: 'mens-fashion',
      description: "Men's clothing and accessories",
      parentId: fashion.id,
      isActive: true,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'womens-fashion' },
    update: {},
    create: {
      name: "Women's Fashion",
      slug: 'womens-fashion',
      description: "Women's clothing and accessories",
      parentId: fashion.id,
      isActive: true,
    },
  });

  console.log('✅ Categories seeded successfully!');
}

seedCategories()
  .catch((e) => {
    console.error('❌ Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
