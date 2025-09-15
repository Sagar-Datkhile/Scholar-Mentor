"use client"

import type { ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

// Using Supabase Auth directly; no global provider is required here.
export function AuthProvider({ children }: AuthProviderProps) {
  return children
}
