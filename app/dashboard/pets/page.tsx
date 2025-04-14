"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useApi, type Pet } from "@/lib/api";
import { Edit, Plus, Trash2 } from "lucide-react";

export default function PetsPage() {
  const api = useApi();
  const { toast } = useToast();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [petToDelete, setPetToDelete] = useState<string | null>(null);

  const fetchPets = async () => {
    try {
      setIsLoading(true);
      const data = await api.pets.fetchAll();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!petToDelete) return;

    try {
      await api.pets.delete(petToDelete);
      setPets(pets.filter((pet) => pet._id !== petToDelete));
      toast({
        title: "Sucesso",
        description: "Pet excluído com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pet.",
        variant: "destructive",
      });
    } finally {
      setPetToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meus Pets</h1>
          <Button onClick={() => router.push("/dashboard/pets/new")}>
            <Plus className="mr-2 h-4 w-4" /> Novo Pet
          </Button>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">Carregando...</div>
        ) : pets.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Nenhum pet cadastrado</h3>
            <p className="mb-4 text-sm text-muted-foreground">Você ainda não possui pets cadastrados no sistema.</p>
            <Button onClick={() => router.push("/dashboard/pets/new")}>
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Pet
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Espécie</TableHead>
                  <TableHead>Raça</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Peso (kg)</TableHead>
                  <TableHead>Dono</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pets.map((pet) => (
                  <TableRow key={pet._id}>
                    <TableCell className="font-medium">{pet.name}</TableCell>
                    <TableCell>{pet.species}</TableCell>
                    <TableCell>{pet.breed}</TableCell>
                    <TableCell>{pet.age}</TableCell>
                    <TableCell>{pet.weight}</TableCell>
                    <TableCell>{typeof pet.owner === "object" && pet.owner ? pet.owner.name : "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => router.push(`/dashboard/pets/${pet._id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog
                          open={petToDelete === pet._id}
                          onOpenChange={(open) => !open && setPetToDelete(null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500"
                              onClick={() => setPetToDelete(pet._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o pet {pet.name}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
