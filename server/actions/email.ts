"use server"

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: 'Sprout&Scribble <onboarding@resend.dev>',
    to: email,
    subject: "Sprout and Scribble - Confirmation Email",
    html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`,
  });
  if (error) return console.log(error);
  if (data) return data;
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-password?token=${token}`
  const { data, error } = await resend.emails.send({
    from: "deved@sproutscribble.store",
    to: email,
    subject: "Sprout and Scribble - Confirmation Email",
    html: `<p>Click here <a href='${confirmLink}'>reset your password</a></p>`,
  })
  if (error) return console.log(error)
  if (data) return data
}