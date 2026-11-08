"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Snap = { pay: (token: string, opts: Record<string, (r?: unknown) => void>) => void };

const SNAP_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

export function BuyButton({ programId, signedIn, label, slug }: { programId: string; signedIn: boolean; label: string; slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function buy() {
    if (!signedIn) return router.push(`/daftar?redirect_url=${encodeURIComponent(`/program/${slug}`)}`);
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal memulai pembayaran.");
      const snap = (window as unknown as { snap?: Snap }).snap;
      if (!snap) throw new Error("Halaman pembayaran belum siap, coba lagi.");
      const done = () => router.push(`/latihan?order=${body.orderId}`);
      snap.pay(body.token, { onSuccess: done, onPending: done, onError: () => toast.error("Pembayaran gagal, silakan coba lagi."), onClose: () => setBusy(false) });
    } catch (e) {
      toast.error((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <>
      <Script src={SNAP_URL} data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} strategy="lazyOnload" />
      <Button size="lg" className="w-full" onClick={buy} disabled={busy}>
        {busy ? "Membuka pembayaran…" : label}
      </Button>
    </>
  );
}
