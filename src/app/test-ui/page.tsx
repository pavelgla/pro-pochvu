"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { Spinner } from "@/components/ui/Spinner";
import { BrandLabel } from "@/components/BrandLabel";

const cityOptions = [
  { value: "msk", label: "Москва" },
  { value: "spb", label: "Санкт-Петербург" },
  { value: "nsk", label: "Новосибирск" },
  { value: "ekb", label: "Екатеринбург" },
  { value: "kzn", label: "Казань" },
];

const demotabs = [
  { id: "all", label: "Все" },
  { id: "ecokon", label: "ЭКО Конь" },
  { id: "tsvetologiya", label: "Цветология" },
];

export default function TestUIPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [city, setCity] = useState("");

  return (
    <div className="container-main section-padding space-y-12">
      <h1>Дизайн-система</h1>

      {/* Buttons */}
      <section className="space-y-4">
        <h2>Кнопки</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm">Primary SM</Button>
          <Button variant="primary">Primary MD</Button>
          <Button variant="primary" size="lg">Primary LG</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2>Карточки</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="font-medium">Default card</p>
            <p className="mt-1 text-sm text-brand-gray-dark/60">Без hover-эффекта</p>
          </Card>
          <Card variant="hover">
            <p className="font-medium">Hover card</p>
            <p className="mt-1 text-sm text-brand-gray-dark/60">Наведите мышку</p>
          </Card>
          <Card variant="hover" className="bg-brand-cream">
            <p className="font-medium">Cream card</p>
            <p className="mt-1 text-sm text-brand-gray-dark/60">Кастомный фон</p>
          </Card>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2>Бейджи</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="bestseller">Хит</Badge>
          <Badge variant="new">Новинка</Badge>
          <Badge variant="sale">-20%</Badge>
          <Badge variant="success">В наличии</Badge>
          <Badge variant="warning">Заканчивается</Badge>
          <Badge variant="info">Предзаказ</Badge>
          <Badge variant="bestseller" size="md">Хит MD</Badge>
        </div>
      </section>

      {/* Brand Labels */}
      <section className="space-y-4">
        <h2>Бренд-лейблы</h2>
        <div className="flex gap-3">
          <BrandLabel brand="ecokon" />
          <BrandLabel brand="tsvetologiya" />
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2>Поля ввода</h2>
        <div className="grid max-w-md gap-4">
          <Input label="Имя" placeholder="Иван Петров" />
          <Input label="Email" placeholder="ivan@mail.ru" error="Введите корректный email" />
          <Input label="Телефон" placeholder="+7 (900) 123-45-67" helper="Для уведомлений о заказе" />
        </div>
      </section>

      {/* Select */}
      <section className="space-y-4">
        <h2>Селект</h2>
        <div className="max-w-md">
          <Select
            label="Город доставки"
            options={cityOptions}
            value={city}
            onChange={setCity}
            searchable
            placeholder="Выберите город"
          />
        </div>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <h2>Табы</h2>
        <Tabs tabs={demotabs} activeTab={activeTab} onChange={setActiveTab} />
        <p className="text-sm text-brand-gray-dark/60">
          Активный таб: <strong>{activeTab}</strong>
        </p>
      </section>

      {/* Spinners */}
      <section className="space-y-4">
        <h2>Спиннеры</h2>
        <div className="flex items-center gap-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <span className="text-brand-green"><Spinner size="md" /></span>
        </div>
      </section>

      {/* Modal */}
      <section className="space-y-4">
        <h2>Модальное окно</h2>
        <Button onClick={() => setModalOpen(true)}>Открыть модал</Button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Пример модала">
          <p className="text-sm text-brand-gray-dark/60">
            Модальное окно с backdrop blur и fade-in анимацией. Закрывается по Escape, клику на оверлей или крестику.
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setModalOpen(false)}>Подтвердить</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Отмена</Button>
          </div>
        </Modal>
      </section>
    </div>
  );
}
