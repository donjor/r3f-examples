import { proxy, useSnapshot } from 'valtio'

const store = proxy({ open: false })
export const useStore = () => useSnapshot(store) as { open: boolean }
export const setOpen = (v: boolean) => {
  store.open = v
}
