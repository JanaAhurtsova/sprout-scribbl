'use client'

import { Session } from "next-auth";
import { signOut } from 'next-auth/react'

export function UserButton({ user, expires }: Session) {
  return <div>
    <h1>{user?.email ?? expires}</h1>
    <button type="button" onClick={() => signOut()}>sign out</button>
  </div>
}