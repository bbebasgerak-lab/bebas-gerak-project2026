"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import { ImageUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Faq } from "@/lib/content-fields";
import { saveContent, uploadImage } from "./actions";

// Tidak memakai <form action>: React mengosongkan ulang form setelah action selesai, jadi kalau ada satu
// kolom yang salah, semua ketikan admin ikut hilang. Di sini isian dipertahankan saat gagal, dan
// dimuat ulang dari isi tersimpan (lewat `key`) saat berhasil.
export function SettingsForm({ children }: { children: ReactNode }) {
  const [pending, start] = useTransition();
  const [version, setVersion] = useState(0);
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          const r = await saveContent(fd);
          if (r?.error) toast.error(r.error);
          else {
            toast.success("Tersimpan. Website sudah diperbarui.");
            setVersion((v) => v + 1);
          }
        });
      }}
    >
      <fieldset key={version} disabled={pending} className="contents">{children}</fieldset>
    </form>
  );
}

// Foto dari HP bisa 5–10 MB. Diperkecil dulu di browser (sisi terpanjang 1600px, JPEG)
// supaya unggahnya cepat dan muat di batas 1 MB Server Action.
async function shrink(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  for (const quality of [0.82, 0.6, 0.4]) {
    const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", quality));
    if (blob && blob.size <= 850_000) return blob;
  }
  throw new Error("terlalu besar");
}

export function ImageField({ name, defaultValue, original }: { name: string; defaultValue: string; original: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", await shrink(file), "foto.jpg");
      const r = await uploadImage(fd);
      if ("error" in r) toast.error(r.error);
      else {
        setUrl(r.url);
        toast.success("Foto terunggah. Tekan Simpan perubahan untuk memasangnya.");
      }
    } catch {
      toast.error("Foto tidak bisa dibaca. Coba foto lain (JPG atau PNG).");
    } finally {
      setBusy(false);
      if (picker.current) picker.current.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau kecil di admin, tidak perlu dioptimalkan */}
      <img src={url} alt="" className="h-28 w-40 rounded-xl border bg-muted object-cover" />
      <input type="hidden" name={name} value={url} />
      <input ref={picker} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => pick(e.target.files?.[0])} />
      <div className="flex flex-col items-start gap-2">
        <Button type="button" variant="outline" disabled={busy} onClick={() => picker.current?.click()}>
          <ImageUp aria-hidden /> {busy ? "Mengunggah…" : "Ganti foto"}
        </Button>
        {url !== original && (
          <button type="button" className="text-sm text-muted-foreground underline underline-offset-4" onClick={() => setUrl(original)}>
            Kembali ke foto awal
          </button>
        )}
      </div>
    </div>
  );
}

export function FaqEditor({ initial }: { initial: Faq[] }) {
  const nextId = useRef(initial.length);
  const [rows, setRows] = useState(() => initial.map((f, id) => ({ id, ...f })));
  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={row.id} className="space-y-3 rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold">Pertanyaan {i + 1}</p>
            <Button type="button" variant="ghost" size="sm" onClick={() => setRows(rows.filter((r) => r.id !== row.id))}>
              <Trash2 aria-hidden /> Hapus
            </Button>
          </div>
          <Input name="faq_q" defaultValue={row.q} placeholder="Pertanyaan" aria-label={`Pertanyaan ${i + 1}`} className="h-11 text-base" />
          <Textarea name="faq_a" defaultValue={row.a} placeholder="Jawaban" aria-label={`Jawaban ${i + 1}`} rows={3} className="text-base" />
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => setRows([...rows, { id: nextId.current++, q: "", a: "" }])}>
        <Plus aria-hidden /> Tambah pertanyaan
      </Button>
    </div>
  );
}
