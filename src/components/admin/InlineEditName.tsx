"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X, Loader2 } from "lucide-react";

export default function InlineEditName({
  id,
  initialName,
  action,
}: {
  id: string;
  initialName: string;
  action: (id: string, name: string) => Promise<{ error?: string }>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEditing() {
    setName(initialName);
    setError(null);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  }

  function cancel() {
    setEditing(false);
    setError(null);
    setName(initialName);
  }

  async function save() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === initialName) {
      cancel();
      return;
    }
    setSaving(true);
    setError(null);
    const result = await action(id, trimmed);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        title="Click to rename"
        className="group inline-flex items-center gap-2 text-left"
      >
        <span>{initialName}</span>
        <Pencil size={13} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
          disabled={saving}
          className="w-full min-w-[180px] rounded border border-brand-primary px-2 py-1 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-60"
        />
        <button
          type="button"
          onClick={save}
          disabled={saving}
          title="Save"
          className="text-green-600 hover:text-green-700 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={saving}
          title="Cancel"
          className="text-gray-400 hover:text-red-600 disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
