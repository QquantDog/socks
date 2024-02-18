import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IFormData {
    email: string;
    password: string;
};

const initialState: IFormData = {
    email: "",
    password: "",
};

export const loginFormSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        show: (state) => console.log("state from fromSlice: ", state),
        reset: (state) => {
            state.email = "";
            state.password = "";
        },
        updateEmail: (state, action: PayloadAction<string>)=>{
            state.email = action.payload;
        },
        updatePassword: (state, action: PayloadAction<string>)=>{
            state.password = action.payload;
        }
    },
});

export type {IFormData}
export const { show, reset, updateEmail, updatePassword } = loginFormSlice.actions;
export default loginFormSlice.reducer;
