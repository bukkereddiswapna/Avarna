import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Address } from "../types";
import { useAuth } from "./AuthContext";

interface AddressContextValue {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => Address;
  updateAddress: (id: string, address: Omit<Address, "id">) => void;
  deleteAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextValue | undefined>(undefined);

function storageKey(userId: string) {
  return `arvana_addresses_${userId}`;
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Load addresses whenever the logged-in user changes.
  useEffect(() => {
    if (!user) {
      setAddresses([]);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      setAddresses(raw ? JSON.parse(raw) : []);
    } catch {
      setAddresses([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(storageKey(user.id), JSON.stringify(addresses));
  }, [addresses, user]);

  const addAddress: AddressContextValue["addAddress"] = (address) => {
    const newAddress: Address = { ...address, id: `addr_${Date.now()}` };
    setAddresses((prev) => [...prev, newAddress]);
    return newAddress;
  };

  const updateAddress: AddressContextValue["updateAddress"] = (id, address) => {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...address, id } : a)));
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AddressContext.Provider value={{ addresses, addAddress, updateAddress, deleteAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses must be used within AddressProvider");
  return ctx;
}
