import { create } from 'zustand'

export const useStoreListCampain = create((set) => ({
    campains:null,
    setCampains:     (value)=>{set({campains:value})}
}));