"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-provider"
import { PawPrint, Users } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const api = useApi()
  const [petCount, setPetCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pets = await api.pets.fetchAll()
        setPetCount(pets.length)

        if (user?.role === "ADMIN") {
          const users = await api.users.fetchAll()
          setUserCount(users.length)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [api, user])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">Carregando...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo, {user?.name}! Aqui está um resumo do seu sistema.</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pets</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{petCount}</div>
              <p className="text-xs text-muted-foreground">Pets cadastrados no sistema</p>
            </CardContent>
          </Card>

          {user?.role === "ADMIN" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userCount}</div>
                <p className="text-xs text-muted-foreground">Usuários cadastrados no sistema</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
