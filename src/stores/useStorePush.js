import { create } from 'zustand'

export const useStorePush = create((set) => ({
  isViewOn: false,
  title:'',
  message:'',
  type:'',

  viewOn: (timeout = 3000) => {
    set({ isViewOn: true })

    setTimeout(() => {
      set({ isViewOn: false })
    }, timeout)
  },
  
  setTitle:(value)=>{set({title:value})},
  setMessage:(value)=>{set({message:value})},
  setType:(value)=>{set({type:value})}

}));