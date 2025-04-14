"use client";

import { useAuth } from "./auth-provider";

export type Pet = {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  description: string;
  owner:
    | {
        _id: string;
        name: string;
        email: string;
      }
    | string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
};

export function useApi() {
  const { token } = useAuth();

  const baseUrl = "http://184.73.58.148:3333/api";

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Pets API
  // Pets API
  const fetchPets = async (): Promise<Pet[]> => {
    // Removido cache do sessionStorage
    const response = await fetch(`${baseUrl}/pets`, { headers });
    if (!response.ok) throw new Error("Failed to fetch pets");
    const data = await response.json();
    return data;
  };

  const fetchPet = async (id: string): Promise<Pet> => {
    const response = await fetch(`${baseUrl}/pets/${id}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch pet");
    return response.json();
  };

  const createPet = async (pet: Omit<Pet, "_id" | "owner" | "createdAt" | "updatedAt">): Promise<Pet> => {
    const response = await fetch(`${baseUrl}/pets`, {
      method: "POST",
      headers,
      body: JSON.stringify(pet),
    });
    if (!response.ok) throw new Error("Failed to create pet");
    return response.json();
  };

  const updatePet = async (id: string, pet: Omit<Pet, "_id" | "owner" | "createdAt" | "updatedAt">): Promise<Pet> => {
    const response = await fetch(`${baseUrl}/pets/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(pet),
    });
    if (!response.ok) throw new Error("Failed to update pet");
    return response.json();
  };

  const deletePet = async (id: string): Promise<Pet> => {
    const response = await fetch(`${baseUrl}/pets/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error("Failed to delete pet");
    return response.json();
  };

  // Users API
  const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch(`${baseUrl}/users`, { headers });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  };

  const fetchUser = async (id: string): Promise<User> => {
    const response = await fetch(`${baseUrl}/users/${id}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  };

  const createUser = async (user: {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "CLIENT";
  }): Promise<User> => {
    const response = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  };

  return {
    pets: {
      fetchAll: fetchPets,
      fetchOne: fetchPet,
      create: createPet,
      update: updatePet,
      delete: deletePet,
    },
    users: {
      fetchAll: fetchUsers,
      fetchOne: fetchUser,
      create: createUser,
    },
  };
}
