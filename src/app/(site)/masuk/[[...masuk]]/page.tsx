import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Masuk" };

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-14">
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-4xl md:text-5xl">Selamat datang kembali</h1>
        <p className="text-lg text-muted-foreground">Masuk dengan akun Google, atau tulis email dan kata sandi Anda.</p>
      </div>
      <SignIn />
    </div>
  );
}
