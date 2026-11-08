import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Daftar" };

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-14">
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-4xl font-semibold">Daftar gratis</h1>
        <p className="text-lg text-muted-foreground">Cukup email. Tidak perlu mengingat password.</p>
      </div>
      <SignUp />
    </div>
  );
}
