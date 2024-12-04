import {Outlet, useNavigate} from "react-router-dom";
import styles from './MainLayout.module.scss';
import logo from '../../assets/logo.svg';
import {Avatar} from "@mui/material";
import {stringAvatar} from "../../utils.ts";
import gameIcon from '../../assets/game-icon.svg';
import faqIcon from '../../assets/faq-icon.svg';
import spamDetectorIcon from '../../assets/spam-detector-icon.svg';
import userStore from "../../stores/UserStore.ts";
import {useEffect, useState} from "react";
import {autorun} from "mobx";

const MainLayout = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState(userStore.storeData.name || '');

    useEffect(() => {
        userStore.fetchCurrentUser();
        const dispose = autorun(() => {
            if (userStore.layoutState === 'error') {
                setError(userStore.errorMsg);
                setLoading(false);
                userStore.currentState = 'pending';
            } else if (userStore.layoutState === 'success') {
                setUserName(userStore.data.name);
                setLoading(false);
                userStore.currentState = 'pending';
            } else if (userStore.layoutState === 'loading') {
                setError('');
                setLoading(true);
                userStore.currentState = 'pending';
            }
        });

        return () => dispose();
    }, []);

    return (
        <div className={styles.mainContainer}>
            <span className={styles.headerContainer}>
                <span className={styles.headerLogoContainer}>
                    <img src={logo} alt="logo"/>
                    <span className={styles.headerLogoText}>Anti-Spam System</span>
                </span>
                <Avatar
                    {...stringAvatar(
                        userName || '',
                        {
                            cursor: 'pointer'
                        }
                    )}
                    onClick={() => {
                        navigate('/main/profile');
                    }}
                />
            </span>
            <div className={styles.contentContainer}>
                <div className={styles.sideBarContainer}>
                    <div
                        className={`${styles.sideBarItem} ${styles.gameIcon}`}
                        onClick={() => navigate('/main/game/start')}>
                        <img src={gameIcon} alt="Game"/>
                        <span className={styles.iconLabel}>Game</span>
                    </div>
                    <div
                        className={`${styles.sideBarItem} ${styles.faqIcon}`}
                        onClick={() => navigate('/main/home')}>
                        <img src={faqIcon} alt="FAQ"/>
                        <span className={styles.iconLabel}>F.A.Q.</span>
                    </div>
                    <div
                        className={`${styles.sideBarItem} ${styles.spamDetectorIcon}`}
                        onClick={() => navigate('/main/spam-detector')}>
                        <img src={spamDetectorIcon} alt="Spam Detector"/>
                        <span className={styles.iconLabel}>Spam Detector</span>
                    </div>
                </div>
                <div className={styles.mainContentContainer}>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
