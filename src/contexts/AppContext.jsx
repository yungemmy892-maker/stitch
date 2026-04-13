import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { PLAN_TIERS, STORAGE_KEYS } from '../constants'

const initialState = {
  isAuthenticated: false,
  user: null, 
  selectedPlan: null,
  cardFrozen: false,
  transactions: [],
  balance: 0,
  error: null,
  isLoading: false,
}

const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setError: (error) =>
          set({
            error: error instanceof Error ? error.message : error,
          }),

        clearError: () =>
          set({ error: null }),

        setLoading: (isLoading) =>
          set({ isLoading }),

        login: (userData) => {
          if (!userData || !userData.email) {
            const errorMsg = 'Invalid user data: email is required'
            set({
              error: errorMsg,
              isLoading: false,
            })
            throw new Error(errorMsg)
          }
          set({
            isAuthenticated: true,
            user: userData,
            error: null,
            isLoading: false,
          })
        },

        logout: () =>
          set({
            ...initialState,
          }),

        setSelectedPlan: (plan) => {
          if (!plan || !plan.id) {
            set({ error: 'Invalid plan' })
            return
          }
          set({ selectedPlan: plan, error: null })
        },

        toggleCardFreeze: () =>
          set((state) => ({
            cardFrozen: !state.cardFrozen,
            error: null,
          })),

        setTransactions: (transactions) => {
          try {
            if (!Array.isArray(transactions)) {
              throw new Error('Transactions must be an array')
            }
            set({
              transactions,
              balance: transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0),
              error: null,
            })
          } catch (error) {
            set({ error: error.message })
          }
        },

        addTransaction: (transaction) => {
          try {
            if (!transaction || typeof transaction.amount !== 'number') {
              throw new Error('Invalid transaction data')
            }
            set((state) => ({
              transactions: [transaction, ...state.transactions],
              balance: state.balance + transaction.amount,
              error: null,
            }))
          } catch (error) {
            set({ error: error.message })
          }
        },

        reset: () => set(initialState),
      }),
      {
        name: STORAGE_KEYS.AUTH,
        getStorage: () => localStorage,
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          selectedPlan: state.selectedPlan,
          cardFrozen: state.cardFrozen,
        }),
      }
    ),
    { name: 'AppStore' }
  )
)

export default useAppStore