"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCartStore } from "@/stores/cart-store";
import {
  getCart,
  updateCart,
  addShippingMethod,
  completeCart,
  getShippingOptions,
} from "@/lib/medusa/cart";
import { initiatePaymentSession } from "@/lib/medusa/checkout";

const addressSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  address_1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().optional(),
  postal_code: z.string().min(1, "Postal code is required"),
  country_code: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

type ShippingOption = {
  id: string;
  name: string;
  amount: number;
};

type Step = "information" | "shipping" | "payment";

export function CheckoutForm() {
  const router = useRouter();
  const { cartId, setCartId } = useCartStore();
  const [step, setStep] = useState<Step>("information");
  const [cart, setCart] = useState<Awaited<ReturnType<typeof getCart>>["cart"] | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country_code: "us",
    },
  });

  useEffect(() => {
    if (!cartId) {
      router.push("/cart");
      return;
    }
    getCart(cartId)
      .then(({ cart }) => setCart(cart))
      .catch(() => router.push("/cart"));
  }, [cartId, router]);

  const handleInformation = (data: AddressFormData) => {
    if (!cartId) return;

    startTransition(async () => {
      setError(null);
      try {
        await updateCart(cartId, {
          email: data.email,
          shipping_address: {
            first_name: data.first_name,
            last_name: data.last_name,
            address_1: data.address_1,
            city: data.city,
            province: data.province || "",
            postal_code: data.postal_code,
            country_code: data.country_code,
            phone: data.phone || "",
          },
          billing_address: {
            first_name: data.first_name,
            last_name: data.last_name,
            address_1: data.address_1,
            city: data.city,
            province: data.province || "",
            postal_code: data.postal_code,
            country_code: data.country_code,
            phone: data.phone || "",
          },
        });

        const options = await getShippingOptions(cartId);
        setShippingOptions(
          (options.shipping_options ?? []).map((o: { id: string; name: string; amount?: number }) => ({
            id: o.id,
            name: o.name,
            amount: o.amount ?? 0,
          }))
        );

        const { cart: updatedCart } = await getCart(cartId);
        setCart(updatedCart);
        setStep("shipping");
      } catch {
        setError("Failed to save address. Please try again.");
      }
    });
  };

  const handleShipping = () => {
    if (!cartId || !selectedShipping) return;

    startTransition(async () => {
      setError(null);
      try {
        await addShippingMethod(cartId, selectedShipping);
        await initiatePaymentSession(cartId);
        const { cart: updatedCart } = await getCart(cartId);
        setCart(updatedCart);
        setStep("payment");
      } catch {
        setError("Failed to set shipping. Please try again.");
      }
    });
  };

  const handlePayment = () => {
    if (!cartId) return;

    startTransition(async () => {
      setError(null);
      try {
        await completeCart(cartId);
        setCartId(null);
        router.push("/checkout/success");
      } catch {
        setError("Payment failed. Please try again.");
      }
    });
  };

  const currencyCode = cart?.currency_code || "usd";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      {/* Form */}
      <div className="lg:col-span-3">
        {/* Step indicators */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          {(["information", "shipping", "payment"] as const).map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted-foreground">/</span>}
              <span
                className={
                  step === s
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            </span>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Information Step */}
        {step === "information" && (
          <form
            onSubmit={handleSubmit(handleInformation)}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Contact & Shipping</h2>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
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
              <Label htmlFor="address_1">Address</Label>
              <Input id="address_1" {...register("address_1")} />
              {errors.address_1 && (
                <p className="mt-1 text-sm text-destructive">{errors.address_1.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} />
                {errors.city && (
                  <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="province">State / Province</Label>
                <Input id="province" {...register("province")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input id="postal_code" {...register("postal_code")} />
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-destructive">{errors.postal_code.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country_code">Country Code</Label>
                <Input
                  id="country_code"
                  placeholder="us"
                  {...register("country_code")}
                />
                {errors.country_code && (
                  <p className="mt-1 text-sm text-destructive">{errors.country_code.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" type="tel" {...register("phone")} />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue to Shipping
            </Button>
          </form>
        )}

        {/* Shipping Step */}
        {step === "shipping" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Shipping Method</h2>

            {shippingOptions.length === 0 ? (
              <p className="text-muted-foreground">
                No shipping options available for your address.
              </p>
            ) : (
              <RadioGroup
                value={selectedShipping}
                onValueChange={setSelectedShipping}
                className="space-y-3"
              >
                {shippingOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between rounded-md border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="cursor-pointer">
                        {option.name}
                      </Label>
                    </div>
                    <span className="text-sm font-medium">
                      {option.amount === 0
                        ? "Free"
                        : `$${(option.amount / 100).toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep("information")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleShipping}
                disabled={!selectedShipping || isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Payment</h2>
            <p className="text-sm text-muted-foreground">
              Payment is processed via Stripe. In test mode, use card number
              4242 4242 4242 4242 with any future expiry and any CVC.
            </p>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep("shipping")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={handlePayment}
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Place Order
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary sidebar */}
      <div className="lg:col-span-2">
        <CartSummary
          subtotal={cart?.subtotal}
          shippingTotal={cart?.shipping_total}
          taxTotal={cart?.tax_total}
          total={cart?.total}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  );
}
