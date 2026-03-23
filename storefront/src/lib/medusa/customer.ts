import { sdk } from "@/lib/sdk";

export async function login(email: string, password: string) {
  return sdk.auth.login("customer", "emailpass", {
    email,
    password,
  });
}

export async function register(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  const token = await sdk.auth.register("customer", "emailpass", {
    email: data.email,
    password: data.password,
  });

  return sdk.store.customer.create(
    {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    },
    {},
    { Authorization: `Bearer ${token}` }
  );
}

export async function logout() {
  return sdk.auth.logout();
}

export async function getCustomer() {
  return sdk.store.customer.retrieve();
}

export async function updateCustomer(data: Record<string, unknown>) {
  return sdk.store.customer.update(data);
}

export async function listOrders(limit = 10, offset = 0) {
  return sdk.store.order.list({ limit, offset });
}

export async function getOrder(id: string) {
  return sdk.store.order.retrieve(id);
}

export async function addAddress(data: Record<string, unknown>) {
  return sdk.store.customer.createAddress(data);
}

export async function updateAddress(addressId: string, data: Record<string, unknown>) {
  return sdk.store.customer.updateAddress(addressId, data);
}

export async function deleteAddress(addressId: string) {
  return sdk.store.customer.deleteAddress(addressId);
}

export async function getRegions() {
  return sdk.store.region.list();
}
