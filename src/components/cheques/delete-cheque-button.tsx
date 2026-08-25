"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCheque } from "@/app/actions/cheque-actions";
import { Loader2 } from "lucide-react";

type DeleteChequeButtonProps = {
  chequeId: number;
};

export default function DeleteChequeButton({
  chequeId,
}: DeleteChequeButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteCheque(chequeId);
      if (res.success) {
        toast.success(res.message || "Cheque deleted successfully");
        router.push("/cheques");
      } else {
        toast.error(res.error || "Failed to delete cheque");
        setConfirming(false);
      }
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
      >
        Delete Cheque
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Delete this cheque?</span>

      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Deleting..." : "Yes, Delete"}
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => setConfirming(false)}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
