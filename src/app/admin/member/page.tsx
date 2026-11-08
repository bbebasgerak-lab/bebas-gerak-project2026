import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionForm } from "@/components/action-form";
import { isActive } from "@/lib/access";
import { db, type Program } from "@/lib/supabase";
import { grantManual, revokeAccess } from "../actions";
import { Field, selectClass } from "../program/program-form";
import { OrdersTable } from "../orders-table";

type AccessWithProgram = {
  user_id: string;
  program_id: string;
  email: string | null;
  expires_at: string | null;
  source: string;
  programs: { title: string } | null;
};

export default async function AdminMembers() {
  const supabase = db();
  const [{ data: programs }, { data: access }, { data: orders }] = await Promise.all([
    supabase.from("programs").select("id, title").order("sort"),
    supabase.from("access").select("*, programs(title)").order("granted_at", { ascending: false }).limit(200),
    supabase.from("orders").select("*, programs(title)").order("created_at", { ascending: false }).limit(50),
  ]);
  const now = new Date();

  return (
    <>
      <h1 className="text-4xl font-semibold">Member & Pesanan</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Beri akses manual</h2>
        <p className="text-muted-foreground">
          Untuk member yang membayar di luar website, atau yang membayar memakai email berbeda. Orangnya harus sudah daftar di website.
        </p>
        <ActionForm action={grantManual} success="Akses diberikan" className="grid items-end gap-4 rounded-2xl border bg-card p-6 md:grid-cols-[1fr_1fr_auto]">
          <Field label="Email member">
            <Input name="email" type="email" required className="h-11 text-base" />
          </Field>
          <Field label="Program">
            <select name="program_id" required className={selectClass}>
              {(programs as Pick<Program, "id" | "title">[] | null)?.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </Field>
          <Button type="submit" size="lg">Beri akses</Button>
        </ActionForm>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Akses member</h2>
        {access?.length ? (
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <Table className="text-base">
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Berlaku sampai</TableHead>
                  <TableHead>Sumber</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {(access as AccessWithProgram[]).map((a) => (
                  <TableRow key={a.user_id + a.program_id}>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.programs?.title}</TableCell>
                    <TableCell>
                      {a.expires_at ? new Date(a.expires_at).toLocaleDateString("id-ID", { dateStyle: "medium" }) : "Selamanya"}{" "}
                      {!isActive(a, now) && <Badge variant="destructive">Habis</Badge>}
                    </TableCell>
                    <TableCell>{a.source === "manual" ? "Manual" : "Pembelian"}</TableCell>
                    <TableCell>
                      <ActionForm action={revokeAccess} success="Akses dicabut">
                        <input type="hidden" name="user_id" value={a.user_id} />
                        <input type="hidden" name="program_id" value={a.program_id} />
                        <Button type="submit" variant="destructive" size="sm">Cabut</Button>
                      </ActionForm>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="rounded-2xl bg-muted p-6 text-muted-foreground">Belum ada member.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Pesanan</h2>
        <OrdersTable orders={orders ?? []} />
      </section>
    </>
  );
}
