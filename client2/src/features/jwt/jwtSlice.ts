import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IToken {
    value: string;
    regDate: string | null;
}

const initialJWT: IToken = {
    value: "",
    regDate: null,
};

// no passing Date or instances - as redux toolkit looks at them as not serializable
// AAAAAAAAAAAAAAA initialState: initialJWT
export const jwtSlice = createSlice({
    name: "jwt",
    initialState: initialJWT,
    reducers: {
        updateJWT: (state, action: PayloadAction<IToken>) => {
            state.value = action.payload.value;
            state.regDate = action.payload.regDate;
        },
        showJWT: (state) => console.log("dispatch show val", state.value),
    },
});

export const { updateJWT, showJWT } = jwtSlice.actions;
export default jwtSlice.reducer;
