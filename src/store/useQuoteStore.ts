import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { elevatorTemplate } from '@/data/elevatorTemplate';
import { defaultPartList, partListTemplates, PartListRow, PartListTemplate } from '@/data/partListDefaults';
import { Lang } from '@/data/translations';

const LEGACY_BUTTON_TEXT = 'Round standard';
const DEFAULT_BUTTON_TEXT = 'Round buttons with Braille';
const DEFAULT_CAR_WALL_TEXT = 'Hairline Stainless Steel 304 1.2mm';
const buildDefaultWarrantyText = (months: number | string = 12) =>
  `${months || 12} months from the date the goods depart from the port of shipment.`;
const LEGACY_CAR_WALL_TEXTS = new Set([
  'Hairline Stainless Steel',
  'Hairline Stainless Steel 304 1',
]);

const normalizeCabinEffect = (cabinEffect: any) => {
  const nextCabinEffect = JSON.parse(JSON.stringify(cabinEffect ?? elevatorTemplate.cabinEffect));
  if (nextCabinEffect.button?.type === 'text' && nextCabinEffect.button.value === LEGACY_BUTTON_TEXT) {
    nextCabinEffect.button.value = DEFAULT_BUTTON_TEXT;
  }
  return nextCabinEffect;
};

const normalizeElevator = (elevator: any) => ({
  ...elevator,
  baseFloorJamb: elevator?.baseFloorJamb ?? elevatorTemplate.baseFloorJamb,
  otherFloorsJamb: elevator?.otherFloorsJamb ?? elevatorTemplate.otherFloorsJamb,
  cabinEffect: normalizeCabinEffect(elevator?.cabinEffect),
  carWall: {
    ...(elevator?.carWall ?? elevatorTemplate.carWall),
    left: LEGACY_CAR_WALL_TEXTS.has(elevator?.carWall?.left)
      ? DEFAULT_CAR_WALL_TEXT
      : (elevator?.carWall?.left ?? elevatorTemplate.carWall.left),
    right: LEGACY_CAR_WALL_TEXTS.has(elevator?.carWall?.right)
      ? DEFAULT_CAR_WALL_TEXT
      : (elevator?.carWall?.right ?? elevatorTemplate.carWall.right),
    rear: LEGACY_CAR_WALL_TEXTS.has(elevator?.carWall?.rear)
      ? DEFAULT_CAR_WALL_TEXT
      : (elevator?.carWall?.rear ?? elevatorTemplate.carWall.rear),
  },
});

const normalizeOptionalItem = (item: any, fallback: OptionalItem) => ({
  ...fallback,
  ...(item ?? {}),
  qty: Number(item?.qty) || fallback.qty,
});

const normalizeQuoteState = (state: any) => {
  if (!state || typeof state !== 'object') return state;
  return {
    ...state,
    warrantyText: state.warrantyText || buildDefaultWarrantyText(state.warrantyMonths),
    quoteRemarks: state.quoteRemarks ?? '',
    shaftFrame: normalizeOptionalItem(state.shaftFrame, initialState.shaftFrame),
    temperedGlass: normalizeOptionalItem(state.temperedGlass, initialState.temperedGlass),
    elevators: Array.isArray(state.elevators)
      ? state.elevators.map(normalizeElevator)
      : state.elevators,
  };
};

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
  qty: number;
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
  warrantyText: string;
  priceValidityDays: number;
  quoteRemarks: string;
  certificationStandard: string;
  showCertificationStandard: boolean;
  exchangeRateBasis: number | string;
  shaftFrame: OptionalItem;
  temperedGlass: OptionalItem;
  showPartList: boolean;
  showFunctionList: boolean;
  partListTemplate: PartListTemplate;
  partList: PartListRow[];
  language: Lang;
  nextId: number;
  setField: (field: keyof Omit<QuoteState, 'elevators' | 'nextId' | 'setField' | 'addElevator' | 'removeElevator' | 'updateElevator' | 'toggleElevatorCollapse' | 'resetToDefaults' | 'fetchExchangeRate' | 'importState' | 'updatePartListItem' | 'setPartListTemplate'>, value: any) => void;
  addElevator: () => void;
  removeElevator: (id: number) => void;
  updateElevator: (id: number, name: string, value: any) => void;
  toggleElevatorCollapse: (id: number) => void;
  updatePartListItem: (id: string, field: 'no' | 'category' | 'label' | 'brand' | 'origin', value: string) => void;
  setPartListTemplate: (template: PartListTemplate) => void;
  resetToDefaults: () => void;
  fetchExchangeRate: () => void;
  importState: (newState: Partial<QuoteState>) => void;
}

const initialState = {
  companyName: 'Your Company Name',
  quotationNo: (() => { const d = new Date(); const yy = String(d.getFullYear()).slice(2); const mm = String(d.getMonth()+1).padStart(2,'0'); const dd = String(d.getDate()).padStart(2,'0'); return `XFJ${yy}${mm}${dd}01`; })(),
  projectName: 'Sample Project',
  quotationType: 'FOB',
  quotationDate: new Date().toLocaleDateString('en-CA'),
  elevators: [{...elevatorTemplate, id: 1}],
  freightDestination: 'e.g., Port of Shanghai',
  freightCost: 600,
  exchangeRate: 1,
  targetCurrency: 'USD',
  deliveryDays: 35,
  paymentTerm: 'Pay a 30% deposit within 3 days of signing to activate the contract; the 70% balance is due 7 working days before delivery.',
  warrantyMonths: 12,
  warrantyText: buildDefaultWarrantyText(12),
  priceValidityDays: 30,
  quoteRemarks: '',
  certificationStandard: 'CE Certification',
  showCertificationStandard: false,
  exchangeRateBasis: 6.8,
  shaftFrame: { enabled: false, text: 'Aluminum/Steel shaft frame as Height _____ m', qty: 1, price: 0 },
  temperedGlass: { enabled: false, text: '10mm Tempered Glass ____ m²', qty: 1, price: 0 },
  showPartList: true,
  showFunctionList: true,
  partListTemplate: 'standard' as PartListTemplate,
  partList: defaultPartList,
  language: 'en' as Lang,
  nextId: 2,
};

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Actions
      setField: (field, value) => set((state) => {
        if (field === 'warrantyMonths') {
          const shouldSyncWarrantyText =
            !state.warrantyText || state.warrantyText === buildDefaultWarrantyText(state.warrantyMonths);
          return {
            warrantyMonths: value,
            ...(shouldSyncWarrantyText ? { warrantyText: buildDefaultWarrantyText(value) } : {}),
          };
        }
        return { [field]: value };
      }),

      addElevator: () => set((state) => {
        const last = state.elevators[state.elevators.length - 1];
        const base = last ? { ...last } : { ...elevatorTemplate };
        // Deep-clone nested objects so mutations don't bleed between elevators
        const newElevator = {
          ...base,
          id: state.nextId,
          title: `Elevator #L${state.nextId}`,
          isCollapsed: false,
          cabinEffect: normalizeCabinEffect(last?.cabinEffect ?? elevatorTemplate.cabinEffect),
          carWall: normalizeElevator(last ?? elevatorTemplate).carWall,
          otherFunctions: (last?.otherFunctions ?? elevatorTemplate.otherFunctions).map((f: any) => ({ ...f })),
        };
        return {
          elevators: [...state.elevators, newElevator],
          nextId: state.nextId + 1,
        };
      }),

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

      setPartListTemplate: (template) => set({
        partListTemplate: template,
        partList: partListTemplates[template].map(row => ({ ...row })),
      }),

      resetToDefaults: () => set({ ...initialState, quotationDate: new Date().toLocaleDateString('en-CA') }),

      fetchExchangeRate: async () => {
        const { targetCurrency } = get();
        if (targetCurrency && targetCurrency !== 'USD' && targetCurrency !== '-') {
          try {
            const response = await fetch(`/api/exchange-rate?currency=${encodeURIComponent(targetCurrency)}`);
            const data = await response.json();
            if (data.rate) {
              set({ exchangeRate: data.rate });
            }
          } catch (error) {
            console.error("Error fetching exchange rate:", error);
          }
        } else {
          set({ exchangeRate: 1 });
        }
      },

      importState: (newState) => set(normalizeQuoteState(newState)),
    }),
    {
      name: 'quote-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      version: 5,
      migrate: (persistedState: any, version) => {
        let nextState = persistedState;
        if (version < 1 && nextState && typeof nextState === 'object') {
          nextState = {
            ...persistedState,
            showCertificationStandard: false,
          };
        }
        if (version < 2) {
          nextState = normalizeQuoteState(nextState);
        }
        if (version < 3) {
          nextState = normalizeQuoteState(nextState);
        }
        if (version < 4) {
          nextState = normalizeQuoteState(nextState);
        }
        if (version < 5) {
          nextState = normalizeQuoteState(nextState);
        }
        return nextState;
      },
    }
  )
);
