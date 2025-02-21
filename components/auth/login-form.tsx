"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useStateAction } from "next-safe-action/stateful-hooks"
import Link from "next/link"
import { AuthCard } from "./auth-card"
import { loginSchema } from "@/types/login-schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { emailSignIn } from "@/server/actions/email-signin"
import { cn } from "@/lib/utils"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"

export const LoginForm = () => {
  const form = useForm({ 
    resolver: zodResolver(loginSchema), 
    defaultValues: {
      email: '',
      password: ''
    },
    mode: "onChange",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useStateAction(emailSignIn, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error)
      if (data?.data?.success) setSuccess(data.data.success)
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    execute(data)
 }
  return <AuthCard cardTitle="Welcome back!"
      backButtonHref="/register"
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
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size="sm" className="my-1 px-0" variant="link" asChild>
                <Link href="/reset">
                  Forgot your password?
                </Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn('w-full', status === 'executing' ? 'animate-puls' : '')}
            >
              Sign In
            </Button>
          </form>
        </Form>
        </div>
      </AuthCard>
}

