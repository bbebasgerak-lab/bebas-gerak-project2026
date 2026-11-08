"use client";

import { useActionState } from "react";
import { toast } from "sonner";

export type ActionResult = { error?: string } | void;

// Form admin: tampilkan notifikasi berhasil/gagal setelah disimpan.
export function ActionForm({
  action,
  success = "Tersimpan",
  className,
  children,
}: {
  action: (fd: FormData) => Promise<ActionResult>;
  success?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [, formAction, pending] = useActionState(async (_: unknown, fd: FormData) => {
    const r = await action(fd);
    if (r?.error) toast.error(r.error);
    else toast.success(success);
    return r;
  }, undefined);
  return (
    <form action={formAction} className={className}>
      <fieldset disabled={pending} className="contents">{children}</fieldset>
    </form>
  );
}
