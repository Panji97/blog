"use client";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { Input, Label } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const res = await loginAction(formData);
      return res ?? null;
    },
    null,
  );

  return (
    <div className="mx-auto max-w-[420px] px-5 py-16 md:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Admin
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">Masuk</h1>
      <p className="mt-3 text-[15px] text-muted">
        Akun contoh:{" "}
        <code className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[13px]">
          admin@example.com / admin123
        </code>
      </p>
      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="next" value="/admin" />
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Kata sandi</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
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
          {pending ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </div>
  );
}
