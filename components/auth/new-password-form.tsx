"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useStateAction } from "next-safe-action/stateful-hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as z from 'zod'

import { AuthCard } from "./auth-card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { newPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/server/actions/new-password";

export const NewPasswordForm = () => {
  const form = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
    mode: "onChange",
  })

  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { execute, status } = useStateAction(newPassword, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error)
      if (data?.data?.success) {
        setSuccess(data.data.success)
      }
    },
  })

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    execute({ password: values.password, token })
  }
return (
    <AuthCard
      cardTitle="Enter a new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="*********"
                        type="password"
                        autoComplete="current-password"
                        disabled={status === "executing"}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forgot your password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  )
}