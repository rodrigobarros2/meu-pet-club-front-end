"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useApi } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

export default function EditPetPage({ params }: { params: { id: string } }) {
  const api = useApi();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    description: "",
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const pet = await api.pets.fetchOne(params.id);
        setFormData({
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          age: pet.age.toString(),
          weight: pet.weight.toString(),
          description: pet.description,
        });
      } catch (error) {
        console.error("Error fetching pet:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do pet.",
          variant: "destructive",
        });
        router.push("/dashboard/pets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [params.id, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.pets.update(params.id, {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: Number.parseInt(formData.age),
        weight: Number.parseFloat(formData.weight),
        description: formData.description,
      });

      toast({
        title: "Sucesso",
        description: "Pet atualizado com sucesso!",
      });

      router.push("/dashboard/pets");
    } catch (error) {
      console.error("Error updating pet:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pet.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">Carregando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Pet</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Informações do Pet</CardTitle>
              <CardDescription>Atualize os dados do seu pet no sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="species">Espécie</Label>
                  <Input id="species" name="species" value={formData.species} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="breed">Raça</Label>
                  <Input id="breed" name="breed" value={formData.breed} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade (anos)</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
