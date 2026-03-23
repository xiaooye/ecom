"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register as registerCustomer } from "@/lib/medusa/customer";

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    startTransition(async () => {
      setError(null);
      try {
        await registerCustomer(data);
        router.push("/account");
        router.refresh();
      } catch {
        setError("Registration failed. This email may already be in use.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-center">Create Account</h1>
      <p className="mt-2 text-center text-muted-foreground">
        Join us for exclusive deals and faster checkout
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" {...register("first_name")} />
            {errors.first_name && (
              <p className="mt-1 text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" {...register("last_name")} />
            {errors.last_name && (
              <p className="mt-1 text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium underline hover:text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
