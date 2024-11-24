import styles from './AuthLayout.module.scss'
import {Outlet} from "react-router-dom";

const AuthLayout = () => {

    return (
        <div className={styles.mainContainer}>
            <div className={styles.innerContainer}>
                <Outlet/>
            </div>
        </div>
    )
}

export default AuthLayout