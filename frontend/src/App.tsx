import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import AuthLayout from "./components/AuthLayout/AuthLayout.tsx";
import AuthSignUp from "./components/AuthSignUp/AuthSignUp.tsx";
import AuthSignIn from "./components/AuthSignIn/AuthSignIn.tsx";
import Home from "./components/Home/Home.tsx";
import MainLayout from "./components/MainLayout/MainLayout.tsx";


function App() {

    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/auth" replace/>}
                />

                <Route path="/auth/*" element={<AuthLayout/>}>
                    <Route index element={<Navigate to="sign-up" replace/>}/>
                    <Route path="sign-up" element={<AuthSignUp/>}/>
                    <Route path="sign-in" element={<AuthSignIn/>}/>
                </Route>

                <Route path={"/main/*"} element={<MainLayout/>}>
                    <Route index element={<Navigate to="home" replace/>}/>
                    <Route path="home" element={<Home/>}/>
                </Route>

            </Routes>

        </BrowserRouter>
    )
}

export default App
