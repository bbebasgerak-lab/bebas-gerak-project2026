import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Masuk" };

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-14">
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-4xl font-semibold">Selamat datang kembali</h1>
        <p className="text-lg text-muted-foreground">Tulis email Anda, lalu masukkan kode yang kami kirim ke email.</p>
      </div>
      <SignIn />
    </div>
  );
}
