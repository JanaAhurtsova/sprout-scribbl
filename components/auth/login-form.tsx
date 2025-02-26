'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStateAction } from 'next-safe-action/stateful-hooks';
import Link from 'next/link';
import { AuthCard } from './auth-card';
import { loginSchema, zLoginSchema } from '@/types/login-schema';
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
import { emailSignIn } from '@/server/actions/email-signin';
import { cn } from '@/lib/utils';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';

export const LoginForm = () => {
  const form = useForm<zLoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const { execute, status } = useStateAction(emailSignIn, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error);
      if (data?.data?.success) setSuccess(data.data.success);
      if (data?.data?.twoFactor) setShowTwoFactor(true);
    },
  });

  const onSubmit = (data: zLoginSchema) => {
    execute(data);
  };
  return (
    <AuthCard
      cardTitle='Welcome back!'
      backButtonHref='/register'
      backButtonLabel='Create a new account'
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {showTwoFactor && (
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem className='mb-3'>
                    <FormLabel>We&apos;ve sent you a two factor code to your email.</FormLabel>
                    <FormControl>
                      <InputOTP disabled={status === 'executing'} {...field} maxLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
              </>
            )}
            <FormSuccess message={success} />
            <FormError message={error} />
            {!showTwoFactor && (
              <Button size='sm' className='my-1 px-0' variant='link' asChild>
                <Link href='/reset'>Forgot your password?</Link>
              </Button>
            )}
            <Button
              type='submit'
              className={cn('w-full', status === 'executing' ? 'animate-puls' : '')}
            >
              {showTwoFactor ? 'Verify' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
