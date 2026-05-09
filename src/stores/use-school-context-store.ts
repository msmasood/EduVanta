"use client";

import { create } from "zustand";
import type { SchoolRole } from "@/lib/constants";

interface SchoolContextState {
  activeSchoolId: string | null;
  activeRole: SchoolRole;
  setActiveSchoolId: (id: string | null) => void;
  setActiveRole: (role: SchoolRole) => void;
}

const useSchoolContextStore = create<SchoolContextState>()((set) => ({
  activeSchoolId: null,
  activeRole: "admin",
  setActiveSchoolId: (id) => set({ activeSchoolId: id }),
  setActiveRole: (role) => set({ activeRole: role }),
}));

export default useSchoolContextStore;
