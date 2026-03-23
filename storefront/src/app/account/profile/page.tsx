"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomer, updateCustomer } from "@/lib/medusa/customer";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    getCustomer()
      .then(({ customer }) => {
        if (customer) {
          reset({
            first_name: customer.first_name || "",
            last_name: customer.last_name || "",
            phone: customer.phone || "",
          });
          setEmail(customer.email || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = (data: ProfileForm) => {
    startTransition(async () => {
      try {
        await updateCustomer(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-md space-y-4">
        <div>
          <Label>Email</Label>
          <Input value={email} disabled className="bg-muted" />
        </div>

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
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" {...register("phone")} />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="mr-2 h-4 w-4" />
          ) : null}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
