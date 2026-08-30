"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function ConfirmDeleteButton({
  action,
  confirmMessage,
  itemName,
  size = 18,
  children,
}: {
  action: () => Promise<any> | void;
  confirmMessage?: string;
  itemName?: string;
  size?: number;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    let message = confirmMessage;
    if (!message && itemName) {
      message = `Delete "${itemName}"? This can't be undone.`;
    }
    if (!message) {
      message = "Are you sure?";
    }
    if (!window.confirm(message)) return;
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
      {children || <Trash2 size={size} />}
    </button>
  );
}
