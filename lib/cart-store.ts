"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, selectedOptions: Record<string, string>) => void;
  removeItem: (productId: string, selectedOptions: Record<string, string>) => void;
  updateQuantity: (productId: string, selectedOptions: Record<string, string>, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const optionsKey = (options: Record<string, string>) =>
  Object.entries(options).sort().map(([k, v]) => `${k}:${v}`).join("|");

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, selectedOptions) => {
        set((state) => {
          const key = optionsKey(selectedOptions);
          const existing = state.items.find(
            (item) => item.product.id === product.id && optionsKey(item.selectedOptions) === key
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && optionsKey(item.selectedOptions) === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return { items: [...state.items, { product, quantity, selectedOptions }] };
        });
      },

      removeItem: (productId, selectedOptions) => {
        const key = optionsKey(selectedOptions);
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && optionsKey(item.selectedOptions) === key)
          ),
        }));
      },

      updateQuantity: (productId, selectedOptions, quantity) => {
        const key = optionsKey(selectedOptions);
        if (quantity <= 0) {
          get().removeItem(productId, selectedOptions);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && optionsKey(item.selectedOptions) === key
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    { name: "army-store-cart" }
  )
);
