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
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";

export function UserButton({ user }: Session) {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [theme])

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
          <TruckIcon size={14} className="mr-1 group-hover:translate-x-1 transition-all duration-300 ease-in-out" /> My orders
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <Settings size={14} className="mr-1 group-hover:rotate-180 transition-all duration-300 ease-in-out" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center group"
          >
            <div className="relative flex mr-3">
              <Sun
                className="group-hover:text-yellow-600 absolute group-hover:rotate-180 dark:scale-0 dark:-rotate-90 transition-all duration-750 ease-in-out"
                size={14}
              />
              <Moon
                className="group-hover:text-blue-400 scale-0 rotate-90 dark:rotate-0 dark:scale-100 transition-all ease-in-out duration-750"
                size={14}
              />
            </div>
            {theme && <p className="dark:text-blue-400 mr-3 text-secondary-foreground/75 text-yellow-600">
              {theme[0].toUpperCase() + theme.slice(1)} Mode
            </p>}
            <Switch
              className="scale-75 "
              checked={checked}
              onCheckedChange={(e) => {
                setChecked((prev) => !prev)
                if (e) setTheme("dark")
                if (!e) setTheme("light")
              }}
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} className="py-2 focus:bg-destructive/30 font-medium cursor-pointer transition-all duration-500">
          <LogOut size={14} className="mr-1 group-hover:scale-75 transition-all duration-300 ease-in-out" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}