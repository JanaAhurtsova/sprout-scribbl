'use client'

import { verifyEmailToken } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./auth-card";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

export const EmailVerificationForm = () => {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerification = useCallback(async () => {
    if (success || error) return;
    if (!token) {
      setError('Token no found');
      return
    }
    verifyEmailToken(token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
        router.push('/login');
      }
    })
  }, [error, router, success, token]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <AuthCard cardTitle="Verify your account." backButtonHref="/login" backButtonLabel="Back to login">
      <div className="flex items-center flex-col w-full justify-center">
        <p>{!success && !error ? "Verifying Email..." : null}</p>
        <FormSuccess message={success}/>
        <FormError message={error} />
      </div>
    </AuthCard>
  )
}