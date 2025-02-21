'use client'

import { Session } from "next-auth";
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";

export function UserButton({ user }: Session) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="w-7 h-7">
            {user?.image ? (
              <Image src={user.image} alt={user.name!} fill={true} />
            ) : <AvatarFallback className="bg-primary/25">
                <div className="font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </AvatarFallback>}
          </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4 flex flex-col items-center gap-1 bg-primary/10 rounded-lg">
          {user?.image && <Image className="rounded-full" src={user.image} alt={user.name!} width={36} height={36} />}
          <p className="font-bold text-xs">{user?.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">{user?.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <TruckIcon size={14} className="mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out" /> My orders
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <Settings size={14} className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <div className="flex items-center">
            <Sun size={14} />
            <Moon size={14} />
            <p>Theme <span>theme</span></p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} className="py-2 focus:bg-destructive/30 font-medium cursor-pointer transition-all duration-500">
          <LogOut size={14} className="mr-3 group-hover:scale-75 transition-all duration-300 ease-in-out" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}