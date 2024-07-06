import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputError } from "../../../types";
import { Link } from "react-router-dom";
import Styles from "./index.module.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<InputError[] | null>(null);
    const navigate = useNavigate();
    const API_URI = import.meta.env.VITE_API_URI;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            return navigate("/");
        }
    }, [navigate]);

    function handleChange(
        value: string,
        setFunction: Dispatch<SetStateAction<string>>
    ): void {
        return setFunction(value);
    }

    async function handleSubmit() {
        const res = await fetch(`${API_URI}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        const json = await res.json();

        if (res.ok) {
            localStorage.setItem("token", json.token);
            return navigate("/");
        }

        const errors: InputError[] = json.errors;
        return setErrors(errors);
    }

    function validateInput(): boolean {
        return (
            email !== "" &&
            password !== ""
        );
    }

    return (
        <form className={Styles.form} onSubmit={e => {
            e.preventDefault();
            handleSubmit();
        }}>
            <h1>Envoy</h1>
            <div className={Styles.information}>
                <input type="email" className={Styles.inputs}
                    placeholder="Email"
                    aria-label="Email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={e => handleChange(e.target.value, setEmail)}
                    required
                />
                <input type="password" className={Styles.inputs}
                    placeholder="Password"
                    aria-label="Password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => handleChange(e.target.value, setPassword)}
                    required
                />
            </div>
            <button className={Styles.submit} disabled={!validateInput()}>Log In</button>
            <div className={Styles.errors}>
                {errors !== null && errors.length !== 0 ?
                    errors.map(err =>
                        <p key={err.path}>{err.msg}</p>
                    )
                    :
                    <></>
                }
            </div>
            <h3>Don't have an account? <Link className={Styles.redirect} to={"/auth/signup"}>Sign up.</Link></h3>
        </form>
    );
}

export default Login;
