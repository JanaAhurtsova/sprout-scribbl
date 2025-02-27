'use server';

import { productSchema } from '@/types/product-schema';
import { actionClient } from './action-client';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { products } from '../schema';
import { revalidatePath } from 'next/cache';

export const createProduct = actionClient
  .schema(productSchema)
  .stateAction(async ({ parsedInput: { description, price, title, id } }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!currentProduct) return { error: 'Product not found' };
        const editedProduct = await db
          .update(products)
          .set({ price, description, title })
          .where(eq(products.id, id))
          .returning();
        revalidatePath('/dashboard/products');
        return { success: `Product ${editedProduct[0].title} has been edited` };
      } else {
        const newProduct = await db
          .insert(products)
          .values({ description, price, title })
          .returning();
        revalidatePath('/dashboard/products');
        return { success: `Product ${newProduct[0].title} has been created` };
      }
    } catch {
      return { error: 'Failed to create product' };
    }
  });
