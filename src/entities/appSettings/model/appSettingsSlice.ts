import { createSlice } from "@reduxjs/toolkit";

interface AppSettingsState {
  paymentMethods: {
    id: number;
    method: string;
    status: boolean;
    selected: boolean;
    label: string;
  }[];
}

const defaultPaymentMethods = [
  {
    id: 1,
    selected: false,
    status: true,
    method: "card",
    label: "Terminal",
  },
  {
    id: 2,
    selected: false,
    status: true,
    method: "transfer",
    label: "O'tkazma",
  },
  {
    id: 3,
    selected: true,
    status: true,
    method: "cash",
    label: "Naqd pul",
  },
  {
    id: 4,
    selected: false,
    status: true,
    method: "hybrid",
    label: "Gibrid",
  },
];

const getInitialPaymentMethods = () => {
  const stored = localStorage.getItem("paymentMethods");
  if (!stored) {
    return defaultPaymentMethods;
  }

  try {
    const parsed = JSON.parse(stored);

    // Check if hybrid method already exists
    const hasHybrid = parsed.some((method: any) => method.method === "hybrid");

    if (!hasHybrid) {
      // Add hybrid method to existing methods
      const updatedMethods = [
        ...parsed,
        {
          id: 4,
          selected: false,
          status: true,
          method: "hybrid",
          label: "Gibrid",
        },
      ];
      // Save updated methods to localStorage
      localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
      return updatedMethods;
    }

    return parsed;
  } catch (error) {
    return defaultPaymentMethods;
  }
};

const initialState: AppSettingsState = {
  paymentMethods: getInitialPaymentMethods(),
};

const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
      localStorage.setItem("paymentMethods", JSON.stringify(action.payload));
    },
  },
});

export const { setPaymentMethods } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;

//: PayloadAction<string>
