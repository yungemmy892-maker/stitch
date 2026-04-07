import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PLAN_TIERS, STORAGE_KEYS } from '../constants'

const initialState = {
  isAuthenticated: false,
  user: null, 
  selectedPlan: null,
  cardFrozen: false,
  transactions: [],
  balance: 0,
}

const useAppStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      login: (userData) =>
        set({
          isAuthenticated: true,
          user: userData,
        }),

      logout: () =>
        set({
          ...initialState,
        }),

      setSelectedPlan: (plan) =>
        set({ selectedPlan: plan }),

      toggleCardFreeze: () =>
        set((state) => ({
          cardFrozen: !state.cardFrozen,
        })),

      setTransactions: (transactions) =>
        set({
          transactions,
          balance: transactions.reduce((sum, tx) => sum + tx.amount, 0),
        }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          balance: state.balance + transaction.amount,
        })),

      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      getStorage: () => localStorage,
    }
  )
)

export default useAppStore