"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ChequeStatus } from "@/lib/cheque-status";

function parseDateOnly(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value) {
    throw new Error("Date is required");
  }

  // Store the calendar date at midnight UTC.
  // This prevents the date from shifting because of the server's timezone.
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  return date;
}

function parseMoney(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Amount is required");
  }

  const amount = value.trim();

  // Allow positive values with up to two decimal places.
  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    throw new Error("Invalid cheque amount");
  }

  if (amount === "0" || /^0+(\.0{1,2})?$/.test(amount)) {
    throw new Error("Cheque amount must be greater than zero");
  }

  return amount;
}

export async function createCheque(formData: FormData) {
  const chequeNumber = formData.get("chequeNumber");
  const bank = formData.get("bank");
  const amount = formData.get("amount");
  const chequeDate = formData.get("chequeDate");
  const dueDate = formData.get("dueDate");
  const status = formData.get("status");
  const notes = formData.get("notes");
  const customerIdValue = formData.get("customerId");

  if (typeof chequeNumber !== "string" || !chequeNumber.trim()) {
    throw new Error("Cheque number is required");
  }

  if (typeof bank !== "string" || !bank.trim()) {
    throw new Error("Bank is required");
  }

  const customerId = Number(customerIdValue);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    throw new Error("Invalid customer");
  }

  if (status !== "PENDING" && status !== "CLEARED" && status !== "BOUNCED") {
    throw new Error("Invalid cheque status");
  }

  const parsedChequeDate = parseDateOnly(chequeDate);
  const parsedDueDate = parseDateOnly(dueDate);
  const parsedAmount = parseMoney(amount);

  if (parsedDueDate < parsedChequeDate) {
    throw new Error("Due date cannot be before cheque date");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  await prisma.cheque.create({
    data: {
      chequeNumber: chequeNumber.trim(),
      bank: bank.trim(),
      amount: parsedAmount,
      chequeDate: parsedChequeDate,
      dueDate: parsedDueDate,
      status,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      customer: {
        connect: {
          id: customerId,
        },
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/cheques");
  revalidatePath(`/customers/${customerId}`);

  redirect(`/customers/${customerId}`);
}

export async function updateCheque(formData: FormData) {
  const id = Number(formData.get("id"));
  const chequeNumber = formData.get("chequeNumber");
  const bank = formData.get("bank");
  const amount = formData.get("amount");
  const chequeDate = formData.get("chequeDate");
  const dueDate = formData.get("dueDate");
  const status = formData.get("status");
  const notes = formData.get("notes");

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid cheque ID");
  }

  if (typeof chequeNumber !== "string" || !chequeNumber.trim()) {
    throw new Error("Cheque number is required");
  }

  if (typeof bank !== "string" || !bank.trim()) {
    throw new Error("Bank is required");
  }

  if (status !== "PENDING" && status !== "CLEARED" && status !== "BOUNCED") {
    throw new Error("Invalid cheque status");
  }

  const parsedChequeDate = parseDateOnly(chequeDate);
  const parsedDueDate = parseDateOnly(dueDate);
  const parsedAmount = parseMoney(amount);

  if (parsedDueDate < parsedChequeDate) {
    throw new Error("Due date cannot be before cheque date");
  }

  const existingCheque = await prisma.cheque.findUnique({
    where: {
      id,
    },
    select: {
      customerId: true,
    },
  });

  if (!existingCheque) {
    throw new Error("Cheque not found");
  }

  await prisma.cheque.update({
    where: {
      id,
    },
    data: {
      chequeNumber: chequeNumber.trim(),
      bank: bank.trim(),
      amount: parsedAmount,
      chequeDate: parsedChequeDate,
      dueDate: parsedDueDate,
      status,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/cheques");
  revalidatePath(`/cheques/${id}`);
  revalidatePath(`/customers/${existingCheque.customerId}`);

  redirect(`/cheques/${id}`);
}

export async function updateChequeStatus(id: number, newStatus: ChequeStatus) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid cheque ID");
  }

  if (newStatus !== "PENDING" && newStatus !== "CLEARED" && newStatus !== "BOUNCED") {
    throw new Error("Invalid cheque status");
  }

  const existing = await prisma.cheque.findUnique({
    where: { id },
    select: { customerId: true },
  });

  if (!existing) {
    throw new Error("Cheque not found");
  }

  await prisma.cheque.update({
    where: { id },
    data: { status: newStatus },
  });

  revalidatePath("/");
  revalidatePath("/cheques");
  revalidatePath(`/cheques/${id}`);
  revalidatePath(`/customers/${existing.customerId}`);
}

export async function deleteCheque(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid cheque ID");
  }

  const cheque = await prisma.cheque.findUnique({
    where: {
      id,
    },
    select: {
      customerId: true,
    },
  });

  if (!cheque) {
    throw new Error("Cheque not found");
  }

  await prisma.cheque.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  revalidatePath("/cheques");
  revalidatePath(`/customers/${cheque.customerId}`);

  redirect("/cheques");
}
