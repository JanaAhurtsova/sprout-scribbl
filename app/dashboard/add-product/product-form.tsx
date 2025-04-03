'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { productSchema, zProductSchema } from '@/types/product-schema';
import { useStateAction } from 'next-safe-action/stateful-hooks';
import { createProduct } from '@/server/actions/create-product';
import { DollarSign } from 'lucide-react';
import Tiptap from './tiptap';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: {
      price: 0,
      description: '',
      title: '',
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get('id');

  const { execute, status } = useStateAction(createProduct, {
    onSuccess(data) {
      if (data.data?.success) {
        router.push('/dashboard/products');
        toast.success(data.data.success);
      }
      if (data?.data?.error) {
        toast.error(data.data.error);
      }
    },
    onError(err) {
      console.log(err);
    },
    onExecute() {
      if (editMode) {
        toast.loading('Editing Product');
      } else {
        toast.loading('Creating Product');
      }
    },
  });

  const onSubmit = (data: zProductSchema) => {
    execute(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Saekdong Stripe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <DollarSign size={36} className='rounded-md bg-muted p-2' />
                      <Input
                        {...field}
                        type='number'
                        placeholder='Your price in USD'
                        step='0.1'
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='w-full'
              disabled={
                status === 'executing' || !form.formState.isValid || !form.formState.isDirty
              }
              type='submit'
            >
              {'Create Product'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
