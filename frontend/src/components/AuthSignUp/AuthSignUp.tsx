import React, {useEffect, useState} from 'react';
import {Button, TextField, InputAdornment, IconButton, InputLabel, OutlinedInput, FormControl} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {autorun} from 'mobx';
import userStore from '../../stores/UserStore'; // Ensure the path is correct
import styles from '../AuthLayout/AuthLayout.module.scss';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthSignUp = observer(() => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [emailErrorText, setEmailErrorText] = useState<string>('');
    const [passwordErrorText, setPasswordErrorText] = useState<string>('');
    const [name, setName] = useState('');
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

        if (emailErrorText || passwordErrorText || !name || !email || !password) {
            return;
        }

        userStore.register({
            name,
            email,
            password,
        });
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

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
        setPasswordErrorText(
            passwordValue && passwordValue.length < 6 ? 'Password must be at least 6 characters long.' : ''
        );
    };

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <div className={styles.formContainer}>
            <span className={styles.formHeaderContainer}>
                <span className={styles.formHeaderText}>Welcome to Anti-Spam System</span>
                <span className={styles.formHeaderDesc}>
                    Send personalized emails, follow up easily, and detect spam letters in real-time.
                </span>
            </span>

            <form onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
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
                        onChange={handlePasswordChange}
                        error={!!passwordErrorText}
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
                    {userStore.state === 'loading' ? 'Signing Up...' : 'Sign Up'}
                </Button>
            </form>

            <span className={styles.formBottomText}>
                Already have an account? <Link to="../sign-in" relative="path">Login</Link>
            </span>
        </div>
    );
});

export default AuthSignUp;
