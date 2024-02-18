import { useAppSelector, useAppDispatch } from "../hooks/typed_dispatch";
import { show, reset, updateEmail, updatePassword } from "../features/form/formSlice";
import type { IFormData } from "../features/form/formSlice";
import { updateJWT, showJWT } from "../features/jwt/jwtSlice";

// hardcoded SERVER_URL for now only - should be changed
const SERVER_URL = "http://localhost:3088";

export function Login() {
    const accessJWTState = useAppSelector((state) => state.jwtReducer); 
    const formState = useAppSelector((state) => state.loginFormReducer);
    const dispatch = useAppDispatch();

    // everything should be either encapsulated with useCallback
    // or shiftedd in suelement(form)

    async function onSubmit(formState: IFormData) {
        // only on shallow
        const passedCopy: IFormData = {...formState}
        dispatch(reset());
        const response = fetch(SERVER_URL + "/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(passedCopy),
        });
        console.log("formstate: ", passedCopy);
        try{
            const result = await (await response).json()
            console.log(result)
            dispatch(updateJWT({value: result, regDate: Date()}))
            // dispatch(showJWT());
        } catch(err){
            // logic with showing error on screen
            console.log(err)
        } finally{
            passedCopy.password = ""
        }
        // data is taken async later - so dispacth earlier - erases formdata
    }

    function handleEmailInput(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        dispatch(updateEmail(e.target.value));
    }
    function handlePasswordInput(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        dispatch(updatePassword(e.target.value));
    }

    async function processForm(e: React.FormEvent) {
        e.preventDefault();
        console.log(formState);
        await onSubmit(formState);
    }

    return (
        <div>
            <form onSubmit={processForm}>
                <label>
                    Email
                    <input type="email" name="email" value={formState.email} onChange={handleEmailInput} />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={formState.password} onChange={handlePasswordInput} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
