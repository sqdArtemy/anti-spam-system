import { Outlet, useNavigate } from "react-router-dom";
import styles from './MainLayout.module.scss';
import logo from '../../assets/logo.png';
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../utils.ts";
import gameIcon from '../../assets/game-icon.svg';
import faqIcon from '../../assets/faq-icon.svg';
import spamDetectorIcon from '../../assets/spam-detector-icon.svg';

const MainLayout = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.mainContainer}>
            <span className={styles.headerContainer}>
                <span className={styles.headerLogoContainer}>
                    <img src={logo} alt="logo"/>
                    <span className={styles.headerLogoText}>Anti-Spam System</span>
                </span>
                <Avatar
                    {...stringAvatar(
                        `Test Test`,
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
                        onClick={() => navigate('/main/game')}>
                        <img src={gameIcon} alt="Game" />
                        <span className={styles.iconLabel}>Game</span>
                    </div>
                    <div
                        className={`${styles.sideBarItem} ${styles.faqIcon}`}
                        onClick={() => navigate('/main/home')}>
                        <img src={faqIcon} alt="FAQ" />
                        <span className={styles.iconLabel}>F.A.Q.</span>
                    </div>
                    <div
                        className={`${styles.sideBarItem} ${styles.spamDetectorIcon}`}
                        onClick={() => navigate('/main/spam-detector')}>
                        <img src={spamDetectorIcon} alt="Spam Detector" />
                        <span className={styles.iconLabel}>Spam Detector</span>
                    </div>
                </div>
                <div className={styles.mainContentContainer}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
