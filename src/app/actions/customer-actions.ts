"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export async function createCustomer(
  formData: FormData
): Promise<ActionResponse<{ id: number }>> {
  try {
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const notes = formData.get("notes");

    if (typeof name !== "string" || !name.trim()) {
      return { success: false, error: "Customer name is required" };
    }

    if (typeof phone !== "string" || !phone.trim()) {
      return { success: false, error: "Customer phone is required" };
    }

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        address:
          typeof address === "string" && address.trim() ? address.trim() : null,
        notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/customers");
    revalidatePath("/cheques/new");

    return {
      success: true,
      message: `Customer "${customer.name}" created successfully!`,
      data: { id: customer.id },
    };
  } catch (error) {
    console.error("Failed to create customer:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create customer",
    };
  }
}

export async function updateCustomer(
  formData: FormData
): Promise<ActionResponse<{ id: number }>> {
  try {
    const id = Number(formData.get("id"));
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const notes = formData.get("notes");

    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: "Invalid customer ID" };
    }

    if (typeof name !== "string" || !name.trim()) {
      return { success: false, error: "Customer name is required" };
    }

    if (typeof phone !== "string" || !phone.trim()) {
      return { success: false, error: "Customer phone is required" };
    }

    const customer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        name: name.trim(),
        phone: phone.trim(),
        address:
          typeof address === "string" && address.trim() ? address.trim() : null,
        notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/customers");
    revalidatePath(`/customers/${id}`);
    revalidatePath("/cheques");
    revalidatePath("/cheques/new");

    return {
      success: true,
      message: `Customer "${customer.name}" updated successfully!`,
      data: { id: customer.id },
    };
  } catch (error) {
    console.error("Failed to update customer:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update customer",
    };
  }
}

export async function deleteCustomer(id: number): Promise<ActionResponse> {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: "Invalid customer ID" };
    }

    const customer = await prisma.customer.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
    revalidatePath("/customers");
    revalidatePath("/cheques");
    revalidatePath("/cheques/new");

    return {
      success: true,
      message: `Customer "${customer.name}" and all associated cheques have been deleted.`,
    };
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete customer",
    };
  }
}

export async function getCustomersForSelection(): Promise<
  Array<{ id: number; name: string; phone: string }>
> {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        phone: true,
      },
    });
    return customers;
  } catch (error) {
    console.error("Failed to fetch customers for selection:", error);
    return [];
  }
}
