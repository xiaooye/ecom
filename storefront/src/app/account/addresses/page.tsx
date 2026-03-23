"use client";

import { useEffect, useState, useTransition } from "react";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getCustomer,
  addAddress,
  deleteAddress,
} from "@/lib/medusa/customer";

interface Address {
  id: string;
  first_name?: string;
  last_name?: string;
  address_1?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country_code?: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchAddresses = () => {
    getCustomer()
      .then(({ customer }) => setAddresses(customer?.addresses ?? []))
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await addAddress({
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          address_1: formData.get("address_1"),
          city: formData.get("city"),
          province: formData.get("province"),
          postal_code: formData.get("postal_code"),
          country_code: formData.get("country_code"),
        });
        setDialogOpen(false);
        fetchAddresses();
      } catch (error) {
        console.error("Failed to add address:", error);
      }
    });
  };

  const handleDelete = (addressId: string) => {
    startTransition(async () => {
      try {
        await deleteAddress(addressId);
        fetchAddresses();
      } catch (error) {
        console.error("Failed to delete address:", error);
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input name="first_name" required />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input name="last_name" required />
                </div>
              </div>
              <div>
                <Label htmlFor="address_1">Address</Label>
                <Input name="address_1" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input name="city" required />
                </div>
                <div>
                  <Label htmlFor="province">State / Province</Label>
                  <Input name="province" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input name="postal_code" required />
                </div>
                <div>
                  <Label htmlFor="country_code">Country Code</Label>
                  <Input name="country_code" placeholder="us" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Address
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-8 flex flex-col items-center py-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No addresses saved</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add an address for faster checkout.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {addr.first_name} {addr.last_name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {addr.address_1}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addr.city}
                    {addr.province ? `, ${addr.province}` : ""} {addr.postal_code}
                  </p>
                  <p className="text-sm text-muted-foreground uppercase">
                    {addr.country_code}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(addr.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
