import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { elevatorTemplate } from '@/data/elevatorTemplate';
import { defaultPartList, PartListRow } from '@/data/partListDefaults';

// Define types for the state
interface Elevator {
  id: number;
  isCollapsed?: boolean;
  // Add other elevator properties here from elevatorTemplate
  [key: string]: any; // Allow flexible properties
}

interface OptionalItem {
  enabled: boolean;
  text: string;
  price: number;
}

interface QuoteState {
  companyName: string;
  quotationNo: string;
  projectName: string;
  quotationType: string;
  quotationDate: string;
  elevators: Elevator[];
  freightDestination: string;
  freightCost: number;
  exchangeRate: number;
  targetCurrency: string;
  deliveryDays: number;
  paymentTerm: string;
  warrantyMonths: number;
  priceValidityDays: number;
  exchangeRateBasis: number | string;
  shaftFrame: OptionalItem;
  temperedGlass: OptionalItem;
  partList: PartListRow[];
  nextId: number;
  setField: (field: keyof Omit<QuoteState, 'elevators' | 'nextId' | 'setField' | 'addElevator' | 'removeElevator' | 'updateElevator' | 'toggleElevatorCollapse' | 'resetToDefaults' | 'fetchExchangeRate' | 'importState' | 'updatePartListItem'>, value: any) => void;
  addElevator: () => void;
  removeElevator: (id: number) => void;
  updateElevator: (id: number, name: string, value: any) => void;
  toggleElevatorCollapse: (id: number) => void;
  updatePartListItem: (id: string, field: 'brand' | 'origin', value: string) => void;
  resetToDefaults: () => void;
  fetchExchangeRate: () => void;
  importState: (newState: Partial<QuoteState>) => void;
}

const initialState = {
  companyName: 'Your Company Name',
  quotationNo: 'Q-2024001',
  projectName: 'Sample Project',
  quotationType: 'FOB',
  quotationDate: new Date().toLocaleDateString('en-CA'),
  elevators: [{...elevatorTemplate, id: 1}],
  freightDestination: 'e.g., Port of Shanghai',
  freightCost: 600,
  exchangeRate: 1,
  targetCurrency: 'USD',
  deliveryDays: 90,
  paymentTerm: 'Pay a 30% deposit within 3 days of signing to activate the contract; the 70% balance is due 7 working days before delivery.',
  warrantyMonths: 12,
  priceValidityDays: 30,
  exchangeRateBasis: 6.8,
  shaftFrame: { enabled: false, text: 'Aluminum/Steel shaft frame as Height _____ m', price: 0 },
  temperedGlass: { enabled: false, text: '10mm Tempered Glass ____ m²', price: 0 },
  partList: defaultPartList,
  nextId: 2,
};

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Actions
      setField: (field, value) => set({ [field]: value }),

      addElevator: () => set((state) => ({
        elevators: [...state.elevators, { ...elevatorTemplate, id: state.nextId }],
        nextId: state.nextId + 1,
      })),

      removeElevator: (id) => set((state) => ({
        elevators: state.elevators.filter(elevator => elevator.id !== id),
      })),

      updateElevator: (id, name, value) => set((state) => ({
        elevators: state.elevators.map(elevator => 
          elevator.id === id ? { ...elevator, [name]: value } : elevator
        ),
      })),

      toggleElevatorCollapse: (id) => set((state) => ({
        elevators: state.elevators.map(elevator =>
          elevator.id === id ? { ...elevator, isCollapsed: !elevator.isCollapsed } : elevator
        ),
      })),

      updatePartListItem: (id, field, value) => set((state) => ({
        partList: state.partList.map(row =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      })),

      resetToDefaults: () => set({ ...initialState, quotationDate: new Date().toLocaleDateString('en-CA') }),

      fetchExchangeRate: async () => {
        const { targetCurrency } = get();
        if (targetCurrency && targetCurrency !== 'USD' && targetCurrency !== '-') {
          try {
            const response = await fetch(`https://open.er-api.com/v6/latest/USD`);
            const data = await response.json();
            if (data.rates && data.rates[targetCurrency]) {
              set({ exchangeRate: data.rates[targetCurrency] });
            }
          } catch (error) {
            console.error("Error fetching exchange rate:", error);
          }
        } else {
          set({ exchangeRate: 1 });
        }
      },

      importState: (newState) => set(newState),
    }),
    {
      name: 'quote-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
