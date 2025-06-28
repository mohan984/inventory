import { products, type Product, type InsertProduct, type UpdateProduct } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Product methods
  getProducts(search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getProductStats(): Promise<{
    totalProducts: number;
    totalSales: string;
    lowStock: number;
    suppliers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (search) {
      query = query.where(ilike(products.name, `%${search}%`));
    }
    
    if (sortBy) {
      const column = products[sortBy as keyof typeof products];
      if (column) {
        query = query.orderBy(sortOrder === 'desc' ? desc(column) : asc(column));
      }
    } else {
      query = query.orderBy(asc(products.name));
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, updateProduct: UpdateProduct): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updateProduct)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getProductStats(): Promise<{
    totalProducts: number;
    totalSales: string;
    lowStock: number;
    suppliers: number;
  }> {
    const allProducts = await db.select().from(products);
    
    const totalProducts = allProducts.length;
    const totalSales = allProducts.reduce((sum, product) => sum + (product.sales * parseFloat(product.price)), 0).toFixed(2);
    const lowStock = allProducts.filter(product => product.quantity < 10).length;
    const suppliers = new Set(allProducts.map(product => product.supplier)).size;
    
    return {
      totalProducts,
      totalSales: `$${totalSales}`,
      lowStock,
      suppliers,
    };
  }
}

export const storage = new DatabaseStorage();
