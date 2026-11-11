import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Daftar" };

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-14">
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-4xl md:text-5xl">Daftar gratis</h1>
        <p className="text-lg text-muted-foreground">Paling cepat dengan akun Google. Bisa juga pakai email dan kata sandi.</p>
      </div>
      <SignUp />
    </div>
  );
}
