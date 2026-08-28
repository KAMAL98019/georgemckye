"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function ConfirmDeleteButton({
  action,
  confirmMessage,
  size = 18,
}: {
  action: () => Promise<void> | void;
  confirmMessage: string;
  size?: number;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!window.confirm(confirmMessage)) return;
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      title="Delete"
      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      <Trash2 size={size} />
    </button>
  );
}
