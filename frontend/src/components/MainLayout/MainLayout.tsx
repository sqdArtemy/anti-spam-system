import {Outlet} from "react-router-dom";
import styles from './MainLayout.module.scss'
import logo from '../../assets/logo.png'
import {Avatar} from "@mui/material";
import {stringAvatar} from "../../utils.ts";


const MainLayout = () => {

    return (
        <div className={styles.mainContainer}>
            <span className={styles.headerContainer}>
                <span className={styles.headerLogoContainer}>
                    <img src={logo} alt="logo"/>
                    <span className={styles.headerLogoText}>Anti-Spam System</span>
                </span>
                 <Avatar
                     {...stringAvatar(
                         `Test Test`
                     )}
                 />
            </span>
            <div className={styles.contentContainer}>
                <div className={styles.sideBarContainer}></div>
                <div className={styles.mainContentContainer}>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default MainLayout