"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from "next/link"

import { AuthCard } from "./auth-card"
import { loginSchema } from "@/types/login-schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const LoginForm = () => {
  const form = useForm({ 
    resolver: zodResolver(loginSchema), 
    defaultValues: {
      email: '',
      password: ''
    },
    mode: "onChange",
  });

const onSubmit = (data: z.infer<typeof loginSchema>) => {
  console.log(data)
 }
  return <AuthCard cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials>
        <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} type="email" autoComplete="email" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="********" {...field} type="password" autoComplete="current-password" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button size="sm" variant="link" asChild>
                <Link href="/auth/reset">
                  Forgot your password
                </Link>
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full my-2"
            >
              Sign In
            </Button>
          </form>
        </Form>
        </div>
      </AuthCard>
}