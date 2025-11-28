"use client"

import { useState, useEffect } from "react"

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedId = localStorage.getItem("librishare_user_id")
    setUserId(storedId)
  }, [])

  return { userId, mounted }
}