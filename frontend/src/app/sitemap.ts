import { MetadataRoute } from "next";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

async function getProducts() {
  try {
    const response = await axios.get(`${API_URL}/products?limit=1000`);
    const data = response.data.data || response.data || {};
    return data.products || [];
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    const data = response.data.data || response.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch categories for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const categories = await getCategories();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: FRONTEND_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${FRONTEND_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${FRONTEND_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${FRONTEND_URL}/introduction`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${FRONTEND_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${FRONTEND_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${FRONTEND_URL}/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map(
    (category: any) => ({
      url: `${FRONTEND_URL}/categories?categoryId=${category.id}`,
      lastModified: category.updatedAt
        ? new Date(category.updatedAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...productPages, ...categoryPages];
}

// Revalidate sitemap every hour
export const revalidate = 3600;
