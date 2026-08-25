"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ChequeStatus } from "@/lib/cheque-status";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

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

export async function createCheque(
  formData: FormData
): Promise<ActionResponse<{ id: number; customerId: number }>> {
  try {
    const chequeNumber = formData.get("chequeNumber");
    const bank = formData.get("bank");
    const amount = formData.get("amount");
    const chequeDate = formData.get("chequeDate");
    const dueDate = formData.get("dueDate");
    const notes = formData.get("notes");
    const customerId = Number(formData.get("customerId"));

    if (!Number.isInteger(customerId) || customerId <= 0) {
      return { success: false, error: "Invalid customer selected" };
    }

    if (typeof chequeNumber !== "string" || !chequeNumber.trim()) {
      return { success: false, error: "Cheque number is required" };
    }

    if (typeof bank !== "string" || !bank.trim()) {
      return { success: false, error: "Bank is required" };
    }

    const parsedChequeDate = parseDateOnly(chequeDate);
    const parsedDueDate = parseDateOnly(dueDate);
    const parsedAmount = parseMoney(amount);

    if (parsedDueDate < parsedChequeDate) {
      return { success: false, error: "Due date cannot be before cheque date" };
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      select: {
        id: true,
      },
    });

    if (!customer) {
      return { success: false, error: "Customer not found" };
    }

    const cheque = await prisma.cheque.create({
      data: {
        customerId,
        chequeNumber: chequeNumber.trim(),
        bank: bank.trim(),
        amount: parsedAmount,
        chequeDate: parsedChequeDate,
        dueDate: parsedDueDate,
        status: "PENDING",
        notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/cheques");
    revalidatePath(`/customers/${customerId}`);

    return {
      success: true,
      message: `Cheque "${cheque.chequeNumber}" created successfully!`,
      data: { id: cheque.id, customerId },
    };
  } catch (error) {
    console.error("Failed to create cheque:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create cheque",
    };
  }
}

export async function updateCheque(
  formData: FormData
): Promise<ActionResponse<{ id: number; customerId: number }>> {
  try {
    const id = Number(formData.get("id"));
    const chequeNumber = formData.get("chequeNumber");
    const bank = formData.get("bank");
    const amount = formData.get("amount");
    const chequeDate = formData.get("chequeDate");
    const dueDate = formData.get("dueDate");
    const status = formData.get("status");
    const notes = formData.get("notes");

    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: "Invalid cheque ID" };
    }

    if (typeof chequeNumber !== "string" || !chequeNumber.trim()) {
      return { success: false, error: "Cheque number is required" };
    }

    if (typeof bank !== "string" || !bank.trim()) {
      return { success: false, error: "Bank is required" };
    }

    if (status !== "PENDING" && status !== "CLEARED" && status !== "BOUNCED") {
      return { success: false, error: "Invalid cheque status" };
    }

    const parsedChequeDate = parseDateOnly(chequeDate);
    const parsedDueDate = parseDateOnly(dueDate);
    const parsedAmount = parseMoney(amount);

    if (parsedDueDate < parsedChequeDate) {
      return { success: false, error: "Due date cannot be before cheque date" };
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
      return { success: false, error: "Cheque not found" };
    }

    const updatedCheque = await prisma.cheque.update({
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

    return {
      success: true,
      message: `Cheque "${updatedCheque.chequeNumber}" updated successfully!`,
      data: { id: updatedCheque.id, customerId: existingCheque.customerId },
    };
  } catch (error) {
    console.error("Failed to update cheque:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update cheque",
    };
  }
}

export async function updateChequeStatus(
  id: number,
  newStatus: ChequeStatus
): Promise<ActionResponse> {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: "Invalid cheque ID" };
    }

    if (
      newStatus !== "PENDING" &&
      newStatus !== "CLEARED" &&
      newStatus !== "BOUNCED"
    ) {
      return { success: false, error: "Invalid cheque status" };
    }

    const existing = await prisma.cheque.findUnique({
      where: { id },
      select: { customerId: true, chequeNumber: true },
    });

    if (!existing) {
      return { success: false, error: "Cheque not found" };
    }

    await prisma.cheque.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/");
    revalidatePath("/cheques");
    revalidatePath(`/cheques/${id}`);
    revalidatePath(`/customers/${existing.customerId}`);

    return {
      success: true,
      message: `Status of "${existing.chequeNumber}" changed to ${newStatus}`,
    };
  } catch (error) {
    console.error("Failed to update cheque status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update cheque status",
    };
  }
}

export async function deleteCheque(
  id: number
): Promise<ActionResponse<{ customerId: number }>> {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: "Invalid cheque ID" };
    }

    const cheque = await prisma.cheque.findUnique({
      where: {
        id,
      },
      select: {
        customerId: true,
        chequeNumber: true,
      },
    });

    if (!cheque) {
      return { success: false, error: "Cheque not found" };
    }

    await prisma.cheque.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
    revalidatePath("/cheques");
    revalidatePath(`/customers/${cheque.customerId}`);

    return {
      success: true,
      message: `Cheque "${cheque.chequeNumber}" has been deleted.`,
      data: { customerId: cheque.customerId },
    };
  } catch (error) {
    console.error("Failed to delete cheque:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete cheque",
    };
  }
}
