'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { registerSchema, zRegisterSchema } from '@/types/register-schema';
import { useStateAction } from 'next-safe-action/stateful-hooks';
import { emailRegister } from '@/server/actions/email-register';

export const RegisterForm = () => {
  const form = useForm<zRegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { execute, status } = useStateAction(emailRegister, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error);
      if (data?.data?.success) setSuccess(data.data.success);
    },
  });

  const onSubmit = (data: zRegisterSchema) => {
    execute(data);
  };
  return (
    <AuthCard
      cardTitle='Create an account!'
      backButtonHref='/login'
      backButtonLabel='Already have an account?'
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Username' {...field} type='text' />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='email@example.com'
                        {...field}
                        type='email'
                        autoComplete='email'
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='********'
                        {...field}
                        type='password'
                        autoComplete='current-password'
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
              className={cn('w-full', status === 'executing' ? 'animate-puls' : '')}
            >
              Register
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
