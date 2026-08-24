"use client";

import { Trash2 } from "lucide-react";
import { deleteCustomer } from "@/app/actions/customer-actions";

type DeleteCustomerButtonProps = {
  customerId: number;
  customerName: string;
};

export default function DeleteCustomerButton({
  customerId,
  customerName,
}: DeleteCustomerButtonProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${customerName}"? All cheques belonging to this customer will also be deleted.`
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteCustomer} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={customerId} />

      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:border-red-300"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </form>
  );
}
