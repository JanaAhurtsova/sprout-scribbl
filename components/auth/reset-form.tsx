'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard } from './auth-card';
import { useStateAction } from 'next-safe-action/stateful-hooks';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { resetSchema } from '@/types/reset-schema';
import { resetPassword } from '@/server/actions/reset-password';

export default function ResetForm() {
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { execute, status } = useStateAction(resetPassword, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error);
      if (data?.data?.success) {
        setSuccess(data.data.success);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof resetSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle='Forgot your password? '
      backButtonHref='/login'
      backButtonLabel='Back to login'
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='email@example.com'
                        type='email'
                        disabled={status === 'executing'}
                        autoComplete='email'
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
            </div>
            <Button
              type='submit'
              className={cn('w-full', status === 'executing' ? 'animate-pulse' : '')}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
