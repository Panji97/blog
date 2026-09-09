"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions";
import { Input, Label } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const res = await registerAction(formData);
      return res ?? null;
    },
    null,
  );

  return (
    <div className="mx-auto max-w-[420px] px-5 py-16 md:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Daftar
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">Buat akun</h1>
      <p className="mt-3 text-[15px] text-muted">
        Isi data diri Anda untuk masuk ke dasbor admin.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nama lengkap</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            placeholder="Nama lengkap"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="nama@email.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Kata sandi</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
          />
        </div>

        {state?.error && (
          <p
            role="alert"
            className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm"
          >
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="w-full" size="lg">
          {pending ? "Mendaftar..." : "Daftar"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}
