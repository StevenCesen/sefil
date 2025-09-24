import { create } from 'zustand'

export const useViewStruct = create((set) => ({
    isViewOn: false,
    struct:null,
    viewOn:(value)=>{set({isViewOn:value})},
    setStruct:(value)=>{set({struct:value})}
}));