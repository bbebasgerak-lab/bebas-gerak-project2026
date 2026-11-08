import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { rupiah } from "@/lib/data";
import type { Order } from "@/lib/supabase";

const label = { paid: "Dibayar", pending: "Menunggu", failed: "Gagal" } as const;

export function OrdersTable({ orders }: { orders: (Order & { programs: { title: string } | null })[] }) {
  if (!orders.length) return <p className="rounded-2xl bg-muted p-6 text-muted-foreground">Belum ada pesanan.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table className="text-base">
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{new Date(o.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</TableCell>
              <TableCell>{o.email}</TableCell>
              <TableCell>{o.programs?.title}</TableCell>
              <TableCell>{rupiah(o.amount)}</TableCell>
              <TableCell>
                <Badge variant={o.status === "paid" ? "default" : o.status === "failed" ? "destructive" : "secondary"}>{label[o.status]}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
