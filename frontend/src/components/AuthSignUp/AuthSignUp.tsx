import styles from '../AuthLayout/AuthLayout.module.scss'
import {Button, TextField} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";


const AuthSignUp = () => {
    const navigate = useNavigate();


    return (

        <div className={styles.formContainer}>
            <span className={styles.formHeaderContainer}>
                <span className={styles.formHeaderText}>Welcome to Anti-Spam System</span>
                <span className={styles.formHeaderDesc}>Send personalized emails, follow-up easily and detect spam letters in real-time.</span>
            </span>
            <TextField id="full-name" label="Full Name" variant="outlined"/>
            <TextField id="email-adress" label="Email Address" variant="outlined"/>
            <TextField id="password" label="Password" variant="outlined"/>
            <Button variant="contained" onClick={() => navigate('/main/home')}>Sign Up</Button>
            <span className={styles.formBottomText}>Already have an account? <Link to="../sign-in"
                                                                                   relative="path">Login</Link></span>
        </div>

    )


}

export default AuthSignUp