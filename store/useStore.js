import { create } from "zustand";
import { useUserSlice } from "./useUserSlice";

export const useStore = create((set, get) => ({
  ...useUserSlice(set, get),
}));
