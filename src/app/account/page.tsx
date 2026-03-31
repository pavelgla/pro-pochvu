"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/types/database";

type Address = {
  id: string;
  label: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
};

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      const addrs = Array.isArray(profile.addresses)
        ? (profile.addresses as unknown as Address[])
        : [];
      setAddresses(addrs);
    }
  }, [profile]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({
        name,
        phone,
        addresses: addresses as unknown as Json,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  function addAddress() {
    setAddresses([
      ...addresses,
      {
        id: crypto.randomUUID(),
        label: `Адрес ${addresses.length + 1}`,
        city: "",
        street: "",
        house: "",
        apartment: "",
      },
    ]);
  }

  function updateAddress(id: string, field: keyof Address, value: string) {
    setAddresses(
      addresses.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  }

  function removeAddress(id: string) {
    setAddresses(addresses.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h2>Профиль</h2>
        <p className="mt-1 text-sm text-brand-gray-dark/60">
          Управляйте вашими данными
        </p>
      </div>

      <div className="grid gap-4 max-w-lg">
        <Input
          label="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          value={user?.email || ""}
          disabled
          helper="Email нельзя изменить"
        />
        <Input
          label="Телефон"
          placeholder="+79001234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Addresses */}
      <div>
        <div className="flex items-center justify-between">
          <h3>Адреса</h3>
          <Button variant="ghost" size="sm" onClick={addAddress}>
            + Добавить адрес
          </Button>
        </div>

        {addresses.length === 0 && (
          <p className="mt-2 text-sm text-brand-gray-dark/40">
            Нет сохранённых адресов
          </p>
        )}

        <div className="mt-3 space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-xl border border-brand-gray-light p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <input
                  value={addr.label}
                  onChange={(e) =>
                    updateAddress(addr.id, "label", e.target.value)
                  }
                  className="text-sm font-medium bg-transparent focus:outline-none"
                  placeholder="Название"
                />
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="text-xs text-brand-gray-dark/40 hover:text-error"
                >
                  Удалить
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Город"
                  value={addr.city}
                  onChange={(e) =>
                    updateAddress(addr.id, "city", e.target.value)
                  }
                />
                <Input
                  placeholder="Улица"
                  value={addr.street}
                  onChange={(e) =>
                    updateAddress(addr.id, "street", e.target.value)
                  }
                />
                <Input
                  placeholder="Дом"
                  value={addr.house}
                  onChange={(e) =>
                    updateAddress(addr.id, "house", e.target.value)
                  }
                />
                <Input
                  placeholder="Квартира"
                  value={addr.apartment}
                  onChange={(e) =>
                    updateAddress(addr.id, "apartment", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button loading={saving} onClick={handleSave}>
          Сохранить
        </Button>
        {saved && (
          <span className="text-sm text-success">Сохранено!</span>
        )}
      </div>
    </div>
  );
}
