import { create } from 'zustand'
import getStruct from '../helpers/Credits/getStruct';

export const useViewStruct = create((set) => ({
    isViewOn: false,
    struct:null,
    viewOn:(value)=>{set({isViewOn:value})},
    setStruct:(value)=>{set({struct:value})},
    clean:()=>{
        set({struct:null}),
        set({isViewOn:false})
    },
    getStruct: async({credit_id,cartera})=>{
        const struct = await getStruct({credit_id:credit_id,cartera:cartera});
        set({struct:struct.data});
        set({isViewOn:true});
    }
}));