import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {Route, Routes} from "react-router-dom"
import { Root } from "./components/root";
import { Login } from "./components/login";


function App() {
    return (
        <div>
            <div>App root entrypoint</div>
            <Routes>
                <Route element={<Root />} path="/" />
                <Route element={<Login />} path="/login" />
            </Routes>
        </div>
    );
}
// import { format } from "path";

export default App;
