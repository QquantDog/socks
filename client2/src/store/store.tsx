import { configureStore } from "@reduxjs/toolkit";
import loginFormReducer from "../features/form/formSlice";
import jwtReducer from "../features/jwt/jwtSlice";

const store = configureStore({
    reducer: { loginFormReducer, jwtReducer },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
