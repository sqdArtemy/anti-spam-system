import spamCheckerEmpty from '../../assets/spam-checker-empty.png';
import spamCheckerScore from '../../assets/spam-checker-score.png';
import topPlayers from '../../assets/top-players.png';
import styles from './Home.module.scss';

const Home = () => {
    return (
        <div className={styles.contentContainer}>
            <span className={`${styles.contentTopContainer}`}>
                <div className={`${styles.headerText}  ${styles.headerTopText}`}>
                    Stay Safe from Phishing and Spam Letters
                </div>
                <span
                    className={styles.headerSubText}
                >We are a dedicated team committed to enhancing online security by providing tools that help users detect phishing and spam emails. Our mission is to ensure that individuals can easily and effectively identify fraudulent activities, protecting their personal and financial information from harm.</span>
            </span>
            <span className={styles.contentItemContainer}>
                <div className={styles.contentItemInnerContainer}>
                    <span className={styles.headerText}>Detect Spam Letters Easily</span>
                    <span
                        className={styles.headerSubText}
                    >Our system utilizes advanced algorithms to analyze the content of emails and determine their likelihood of being phishing attempts or spam. With a user-friendly interface, anyone can upload an email, and within seconds, receive a detailed report on its trustworthiness.</span>
                </div>
                <img src={spamCheckerEmpty} alt="spamCheckerEmpty" style={{
                    width: '45%'

                }}/>
            </span>
            <span className={styles.contentItemContainer}>
                <img src={spamCheckerScore} alt="spamCheckerScore" style={{
                    width: '50%'

                }}/>
                <div className={styles.contentItemInnerContainer}>
                    <span className={styles.headerText}>Try to detect by Yourself</span>
                    <span
                        className={styles.headerSubText}
                    >We’ve incorporated a game system to make learning about phishing detection both fun and educational. Users can compete by identifying phishing emails with accuracy and speed, earning points and rising through the ranks.</span>
                </div>
            </span>
            <span className={styles.contentItemContainer} >
                <div className={styles.contentItemInnerContainer}>
                    <span className={styles.headerText}>Compete with  Others</span>
                    <span
                        className={styles.headerSubText}
                    >Compete with others and see how your skills stack up! The leaderboard displays the top performers based on their accuracy in detecting phishing attempts. Will you be the next “Top G” of phishing detection?</span>
                </div>
                <img src={topPlayers} alt="topPlayers"
                    style={{
                        marginRight: '5%',
                    }}
                />
            </span>
        </div>
    );
}

export default Home;