"use client";

import { toast } from "sonner";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteCategory } from "./actions";

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const handleDelete = async () => {
    const result = await deleteCategory(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`"${name}" deleted.`);
    }
  };

  return (
    <ConfirmDeleteButton
      action={handleDelete}
      confirmMessage={`Delete "${name}"? This can't be undone.`}
      size={16}
    />
  );
}
