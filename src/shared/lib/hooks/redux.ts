import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type {
  RootState,
  AppDispatch,
} from "@/app/providers/StoreProvider/config/store";

// Хук для dispatch с типами
export const useAppDispatch: () => AppDispatch = useDispatch;

// Хук для selector с типами
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
