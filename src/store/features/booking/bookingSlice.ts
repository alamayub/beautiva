import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SlotHold {
  date: string;
  timeSlot: string;
  city: string;
  expiresAt: number; // Unix timestamp in ms (10 minutes from selection)
}

export interface BookingLocationState {
  city: string;
  pincode: string;
  locality: string;
  isLocationConfirmed: boolean;
  slotHold: SlotHold | null;
}

export const SERVICEABLE_CITIES: Record<
  string,
  {
    name: string;
    state: string;
    pincodePrefixes: string[];
    samplePincodes: string[];
    localities: string[];
    stylistsCount: number;
  }
> = {
  Lucknow: {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    pincodePrefixes: ['226'],
    samplePincodes: ['226010', '226028', '226001', '226016'],
    localities: ['Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Hazratganj', 'Mahanagar', 'Chinhat'],
    stylistsCount: 24,
  },
  Patna: {
    name: 'Patna',
    state: 'Bihar',
    pincodePrefixes: ['800'],
    samplePincodes: ['800001', '800013', '800020', '800014'],
    localities: ['Patliputra', 'Boring Road', 'Bailey Road', 'Kankarbagh', 'Rajendra Nagar'],
    stylistsCount: 18,
  },
  Kanpur: {
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    pincodePrefixes: ['208'],
    samplePincodes: ['208001', '208002', '208025', '208011'],
    localities: ['Civil Lines', 'Swaroop Nagar', 'Kakadeo', 'Kidwai Nagar'],
    stylistsCount: 16,
  },
  Gorakhpur: {
    name: 'Gorakhpur',
    state: 'Uttar Pradesh',
    pincodePrefixes: ['273'],
    samplePincodes: ['273001', '273010', '273016'],
    localities: ['Civil Lines', 'Golghar', 'Medical Road', 'Taramandal'],
    stylistsCount: 12,
  },
  Varanasi: {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    pincodePrefixes: ['221'],
    samplePincodes: ['221001', '221010', '221005'],
    localities: ['Sigra', 'Bhelupur', 'Mahmoorganj', 'Lanka', 'Cantt'],
    stylistsCount: 14,
  },
  'New Delhi NCR': {
    name: 'New Delhi NCR',
    state: 'Delhi NCR',
    pincodePrefixes: ['110', '201', '122'],
    samplePincodes: ['110048', '110075', '201301', '122002'],
    localities: ['South Ext', 'Greater Kailash', 'Dwarka', 'Noida Sec 62', 'Gurugram Phase 5'],
    stylistsCount: 35,
  },
};

export const checkPincodeServiceability = (
  pincode: string,
  preferredCity?: string
): { serviceable: boolean; matchedCity: string | null; message: string } => {
  const clean = pincode.trim();
  if (!/^\d{6}$/.test(clean)) {
    return {
      serviceable: false,
      matchedCity: null,
      message: 'Please enter a valid 6-digit Indian PIN code.',
    };
  }

  const prefix = clean.slice(0, 3);
  for (const [cityKey, info] of Object.entries(SERVICEABLE_CITIES)) {
    if (info.pincodePrefixes.includes(prefix)) {
      return {
        serviceable: true,
        matchedCity: cityKey,
        message: `Service available in ${cityKey} (${clean})! ${info.stylistsCount} verified beauticians active.`,
      };
    }
  }

  return {
    serviceable: false,
    matchedCity: null,
    message: `Sorry, doorstep service is not yet available at PIN ${clean}. We currently serve Lucknow (226xxx), Patna (800xxx), Kanpur (208xxx), Gorakhpur (273xxx), Varanasi (221xxx), and Delhi NCR (110xxx / 201xxx / 122xxx).`,
  };
};

const loadInitialLocation = (): Omit<BookingLocationState, 'slotHold'> => {
  try {
    const raw = localStorage.getItem('beautiva_location');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.city === 'string') {
        return {
          city: parsed.city,
          pincode: parsed.pincode || '',
          locality: parsed.locality || SERVICEABLE_CITIES[parsed.city]?.localities[0] || '',
          isLocationConfirmed: Boolean(parsed.isLocationConfirmed),
        };
      }
    }
  } catch {
    // fallback
  }
  return {
    city: 'Lucknow',
    pincode: '',
    locality: 'Gomti Nagar',
    isLocationConfirmed: false,
  };
};

const loadInitialSlotHold = (): SlotHold | null => {
  try {
    const raw = localStorage.getItem('beautiva_slot_hold');
    if (raw) {
      const parsed: SlotHold = JSON.parse(raw);
      if (parsed && parsed.expiresAt > Date.now()) {
        return parsed;
      }
      localStorage.removeItem('beautiva_slot_hold');
    }
  } catch {
    // fallback
  }
  return null;
};

const initialLoc = loadInitialLocation();

const initialState: BookingLocationState = {
  ...initialLoc,
  slotHold: loadInitialSlotHold(),
};

export const SLOT_HOLD_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    confirmLocation: (
      state,
      action: PayloadAction<{ city: string; pincode: string; locality?: string }>
    ) => {
      state.city = action.payload.city;
      state.pincode = action.payload.pincode;
      state.locality =
        action.payload.locality ||
        SERVICEABLE_CITIES[action.payload.city]?.localities[0] ||
        '';
      state.isLocationConfirmed = true;
      try {
        localStorage.setItem(
          'beautiva_location',
          JSON.stringify({
            city: state.city,
            pincode: state.pincode,
            locality: state.locality,
            isLocationConfirmed: true,
          })
        );
      } catch {
        // ignore
      }
    },
    resetLocationConfirmation: (state) => {
      state.isLocationConfirmed = false;
      try {
        localStorage.setItem(
          'beautiva_location',
          JSON.stringify({
            city: state.city,
            pincode: state.pincode,
            locality: state.locality,
            isLocationConfirmed: false,
          })
        );
      } catch {
        // ignore
      }
    },
    holdSlot: (
      state,
      action: PayloadAction<{ date: string; timeSlot: string; city: string }>
    ) => {
      const hold: SlotHold = {
        date: action.payload.date,
        timeSlot: action.payload.timeSlot,
        city: action.payload.city,
        expiresAt: Date.now() + SLOT_HOLD_DURATION_MS,
      };
      state.slotHold = hold;
      try {
        localStorage.setItem('beautiva_slot_hold', JSON.stringify(hold));
      } catch {
        // ignore
      }
    },
    releaseSlotHold: (state) => {
      state.slotHold = null;
      try {
        localStorage.removeItem('beautiva_slot_hold');
      } catch {
        // ignore
      }
    },
  },
});

export const {
  confirmLocation,
  resetLocationConfirmation,
  holdSlot,
  releaseSlotHold,
} = bookingSlice.actions;

export default bookingSlice.reducer;
