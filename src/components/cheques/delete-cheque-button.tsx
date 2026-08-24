"use client";

import { useState } from "react";
import { deleteCheque } from "@/app/actions/cheque-actions";

type DeleteChequeButtonProps = {
  chequeId: number;
};

export default function DeleteChequeButton({
  chequeId,
}: DeleteChequeButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Delete Cheque
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Delete this cheque?</span>

      <form action={deleteCheque}>
        <input type="hidden" name="id" value={chequeId} />

        <button
          type="submit"
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </form>

      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  );
}
