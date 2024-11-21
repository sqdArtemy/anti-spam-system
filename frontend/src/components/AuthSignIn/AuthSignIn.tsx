import styles from "../AuthLayout/AuthLayout.module.scss";
import {Button, TextField} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";

const AuthSignIn = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.formContainer}>
            <span className={styles.formHeaderContainer}>
                <span className={styles.formHeaderText}>Login</span>
                <span className={styles.formHeaderDesc}>Welcome back! Let's take you to your account.</span>
            </span>
            <TextField id="email-adress" label="Email Address" variant="outlined"/>
            <TextField id="password" label="Password" variant="outlined"/>
            <Button variant="contained" onClick={() => navigate('/main/home')}>Continue</Button>
            <span className={styles.formBottomText}>Don't have an account? <Link to="../sign-up"
                                                                                 relative="path">Sign Up</Link></span>
        </div>
    )
}

export default AuthSignIn