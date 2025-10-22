import { create } from 'zustand'

export const useStoreLoader = create((set) => ({
  isViewOn: false,
  viewOn: (value) =>{set({ isViewOn: value })}
}));