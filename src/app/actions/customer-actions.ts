"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createCustomer(formData: FormData) {
  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const address = formData.get("address");
  const notes = formData.get("notes");

  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Customer name is required");
  }

  if (typeof phone !== "string" || !phone.trim()) {
    throw new Error("Customer phone is required");
  }

  await prisma.customer.create({
    data: {
      name: name.trim(),
      phone: phone.trim(),
      email: typeof email === "string" && email.trim() ? email.trim() : null,
      address:
        typeof address === "string" && address.trim() ? address.trim() : null,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  revalidatePath("/customers");
  redirect("/customers");
}

export async function updateCustomer(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const address = formData.get("address");
  const notes = formData.get("notes");

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid customer ID");
  }

  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Customer name is required");
  }

  if (typeof phone !== "string" || !phone.trim()) {
    throw new Error("Customer phone is required");
  }

  await prisma.customer.update({
    where: {
      id,
    },
    data: {
      name: name.trim(),
      phone: phone.trim(),
      email: typeof email === "string" && email.trim() ? email.trim() : null,
      address:
        typeof address === "string" && address.trim() ? address.trim() : null,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);

  redirect(`/customers/${id}`);
}

export async function deleteCustomer(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid customer ID");
  }

  await prisma.customer.delete({
    where: {
      id,
    },
  });

  revalidatePath("/customers");

  redirect("/customers");
}
