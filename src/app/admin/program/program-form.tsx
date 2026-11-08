import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActionForm } from "@/components/action-form";
import type { Program } from "@/lib/supabase";
import { saveProgram } from "../actions";

export const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-base";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-base font-bold">{label}</Label>
      {children}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ProgramForm({ program }: { program?: Program }) {
  return (
    <ActionForm action={saveProgram} success="Program tersimpan" className="grid gap-5 rounded-2xl border bg-card p-6 md:grid-cols-2">
      {program && <input type="hidden" name="id" value={program.id} />}
      <Field label="Judul">
        <Input name="title" defaultValue={program?.title} required className="h-11 text-base" />
      </Field>
      <Field label="Alamat halaman" hint="Huruf kecil dan tanda minus. Contoh: mulai-bergerak">
        <Input name="slug" defaultValue={program?.slug} required className="h-11 text-base" />
      </Field>
      <Field label="Kalimat singkat">
        <Input name="tagline" defaultValue={program?.tagline ?? ""} className="h-11 text-base" />
      </Field>
      <Field label="Level" hint="Contoh: Pemula, Semua level">
        <Input name="level" defaultValue={program?.level ?? ""} className="h-11 text-base" />
      </Field>
      <div className="md:col-span-2">
        <Field label="Deskripsi">
          <Textarea name="description" defaultValue={program?.description ?? ""} rows={4} className="text-base" />
        </Field>
      </div>
      <Field label="Jenis">
        <select name="kind" defaultValue={program?.kind ?? "program"} className={selectClass}>
          <option value="program">Program (berisi video)</option>
          <option value="membership">Membership (membuka semua program)</option>
        </select>
      </Field>
      <Field label="Harga (Rp)">
        <Input name="price" type="number" min={1000} step={1000} defaultValue={program?.price} required className="h-11 text-base" />
      </Field>
      <Field label="Lama akses (hari)" hint="Kosongkan = akses selamanya. 30 = sebulan, 365 = setahun.">
        <Input name="access_days" type="number" min={1} defaultValue={program?.access_days ?? ""} className="h-11 text-base" />
      </Field>
      <Field label="Urutan tampil" hint="Angka kecil tampil lebih dulu.">
        <Input name="sort" type="number" defaultValue={program?.sort ?? 0} className="h-11 text-base" />
      </Field>
      <label className="flex items-center gap-3 text-base font-bold md:col-span-2">
        <input type="checkbox" name="is_published" defaultChecked={program?.is_published ?? false} className="size-6 accent-primary" />
        Tampilkan di website
      </label>
      <div className="md:col-span-2">
        <Button type="submit" size="lg">{program ? "Simpan perubahan" : "Buat program"}</Button>
      </div>
    </ActionForm>
  );
}
