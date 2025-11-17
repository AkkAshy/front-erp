import { combineReducers } from "@reduxjs/toolkit";
import appSettingsReducer from "@/entities/appSettings/model/appSettingsSlice";

export const rootReducer = combineReducers({
  appSettings: appSettingsReducer,
});
