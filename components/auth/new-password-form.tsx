'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStateAction } from 'next-safe-action/stateful-hooks';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import { AuthCard } from './auth-card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { newPasswordSchema, zNewPasswordSchema } from '@/types/new-password-schema';
import { newPassword } from '@/server/actions/new-password';

export const NewPasswordForm = () => {
  const form = useForm<zNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
  });

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { execute, status } = useStateAction(newPassword, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error);
      if (data?.data?.success) {
        setSuccess(data.data.success);
      }
    },
  });

  const onSubmit = (values: zNewPasswordSchema) => {
    execute({ password: values.password, token });
  };
  return (
    <AuthCard
      cardTitle='Enter a new password'
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
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='*********'
                        type='password'
                        autoComplete='current-password'
                        disabled={status === 'executing'}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size={'sm'} variant={'link'} asChild>
                <Link href='/reset'>Forgot your password</Link>
              </Button>
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
};
