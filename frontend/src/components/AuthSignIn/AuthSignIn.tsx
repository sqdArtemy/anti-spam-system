import React, {useEffect, useState} from 'react';
import {Button, TextField, InputAdornment, IconButton, InputLabel, OutlinedInput, FormControl} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import userStore from '../../stores/UserStore'; // Ensure the path is correct
import styles from '../AuthLayout/AuthLayout.module.scss';
import {autorun} from 'mobx';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthSignIn = observer(() => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [emailErrorText, setEmailErrorText] = useState<string>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        autorun(() => {
            if (userStore.state === 'error') {
                setError(userStore.errorMsg);
            } else if (userStore.state === 'success') {
                if (localStorage.getItem('accessToken')) {
                    navigate('/main/home');
                }
            } else if (userStore.state === 'loading') {
                setError('');
            }
        });
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (emailErrorText || !email || !password) return;

        userStore.login(email, password);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        setEmailErrorText(
            emailValue && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(emailValue)
                ? 'Please enter a valid email address.'
                : ''
        );
    };

    // Toggle password visibility
    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <div className={styles.formContainer}>
            <span className={styles.formHeaderContainer}>
                <span className={styles.formHeaderText}>Login</span>
                <span className={styles.formHeaderDesc}>Welcome back! Let's take you to your account.</span>
            </span>

            <form onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    fullWidth
                    value={email}
                    error={!!emailErrorText}
                    helperText={emailErrorText}
                    onChange={handleEmailChange}
                />

                <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                {error && <div className={styles.formError}>{error}</div>}

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    type="submit"
                    style={{marginTop: '1rem'}}
                    disabled={userStore.state === 'loading'}
                >
                    {userStore.state === 'loading' ? 'Logging In...' : 'Continue'}
                </Button>
            </form>

            <span className={styles.formBottomText}>
                Don't have an account? <Link to="../sign-up" relative="path">Sign Up</Link>
            </span>
        </div>
    );
});

export default AuthSignIn;
