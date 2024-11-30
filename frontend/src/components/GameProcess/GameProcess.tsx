import {useEffect, useState} from "react";
import {Box, Typography, Button, Stack, Paper, Card, CardContent, List, ListItem, LinearProgress} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {observer} from "mobx-react";
import gameStore from "../../stores/GameStore.ts";
import {autorun} from "mobx";
import {IGameAnalysis} from "../../api/interfaces/requests/game.ts";
import {useNavigate} from "react-router-dom";

const GameProcess = observer(() => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0); // Current score
    const [time, setTime] = useState(0); // Timer (in seconds)
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0); // Track current letter
    const [correctlyIdentified, setCorrectlyIdentified] = useState<Array<boolean | null>>([]); // Track correctness of each decision
    const [decisionHistory, setDecisionHistory] = useState<Array<"spam" | "not spam">>([]);

    const totalLetters = gameStore.data.checkRequests.length;

    useEffect(() => {

        autorun(() => {
            if (gameStore.state === "success" && gameStore.data.gameId !== -1) {
                const initialIdentifications = new Array(totalLetters).fill(null);
                setCorrectlyIdentified(initialIdentifications);
            } else if (gameStore.state === "error") {
                console.error("Error: ", gameStore.errorMsg);
            }

            if (gameStore.finishState === "success") {
                navigate("/main/game/finish");
            }
        });

        const timerInterval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [totalLetters]);

    const handleDecision = (decision: "spam" | "not spam") => {
        const currentRequest = gameStore.data.checkRequests[currentLetterIndex];

        const isCorrect = (decision === "spam" && currentRequest.aiSus) || (decision === "not spam" && !currentRequest.aiSus);
        setCorrectlyIdentified((prev) => {
            const updated = [...prev];
            updated[currentLetterIndex] = isCorrect;
            return updated;
        });

        setDecisionHistory((prev) => [...prev, decision]);

        if (isCorrect) {
            setScore((prev) => prev + 1);
        }

        if (currentLetterIndex === totalLetters - 1) {
            const updatedDecisionHistory = [...decisionHistory, decision]; // Append the current decision
            const analysisData = gameStore.data.checkRequests.map((request, index) => ({
                checkRequestId: request.id,
                actualSus: request.actualSus,
                userSus: updatedDecisionHistory[index] === "spam", // Use the updated history
            }));

            const gameAnalysis: IGameAnalysis = {
                maxTime: time.toString(),
                data: analysisData,
            };

            gameStore.finishData = {score, ...gameAnalysis};
            gameStore.finishGame(gameStore.data.gameId, gameAnalysis);
        } else {

            setCurrentLetterIndex((prev) => prev + 1);
        }
    };


    const renderTickCross = (isCorrect: boolean | null) => {
        if (isCorrect === null) {
            return <Typography variant="body2">❓</Typography>; // Placeholder for unverified letters
        }
        return isCorrect ? <CheckIcon color="success"/> : <ClearIcon color="error"/>;
    };

    const currentLetter = gameStore.data.checkRequests[currentLetterIndex]; // Get the current letter to display

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            padding: "2rem 4rem"
        }}>

            <Box sx={{flex: 1, display: "flex", alignItems: "center", gap: "0.5rem"}}>
                <Box sx={{
                    flex: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 4
                }}>

                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        maxWidth: "600px",
                        marginBottom: 2
                    }}>
                        <Typography variant="h6" fontWeight="bold">Score: {score}</Typography>
                        <Typography variant="h6"
                                    fontWeight="bold">Time: {new Date(time * 1000).toISOString().substr(14, 5)}</Typography>
                    </Box>


                    <Box sx={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: 4,
                        backgroundColor: "white",
                        width: "100%",
                        maxWidth: "600px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        maxHeight: "550px",
                        height: "550px",
                        overflowY: "auto"
                    }}>
                        <Typography variant="body1">{currentLetter.input}</Typography>
                    </Box>


                    <Stack direction="row" spacing={2} sx={{marginTop: 4, justifyContent: "center", width: 400}}>
                        <Button variant="contained" color="error" size="large" onClick={() => handleDecision("spam")}
                                fullWidth>SPAM</Button>
                        <Button variant="contained" color="success" size="large"
                                onClick={() => handleDecision("not spam")} fullWidth>NOT SPAM</Button>
                    </Stack>
                </Box>
            </Box>


            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "600px",
                overflowY: "auto"
            }}>
                <Paper sx={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: 2,
                    backgroundColor: "white",
                    width: "100%",
                    maxWidth: "600px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    maxHeight: "max-content"
                }}>
                    {Array.from({length: totalLetters}, (_, index) => (
                        <Box key={index} sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 2,
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
                        }}>
                            <Typography variant="body2"
                                        sx={{width: "30px", textAlign: "center"}}>{index + 1}</Typography>
                            <Box sx={{display: "flex", alignItems: "center", marginLeft: 2}}>
                                {renderTickCross(correctlyIdentified[index])}
                            </Box>
                        </Box>
                    ))}
                </Paper>
            </Box>


            <Box sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 4
            }}>
                <Card variant="outlined" sx={{
                    borderColor: "gold",
                    width: "100%",
                    maxWidth: 450,
                    height: "600px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingTop: "2rem"
                }}>
                    <CardContent sx={{width: "100%"}}>
                        <Typography variant="h6" fontWeight="bold" sx={{textAlign: "center"}}>🏆 TOP 10
                            Players</Typography>
                        <List sx={{width: "100%", padding: 0, marginTop: 3}}>
                            {gameStore.topPlayers?.map((player, index) => (
                                <ListItem key={`${player.userName}-${index}`} sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 0",
                                    justifyContent: "center"
                                }}>
                                    <Typography variant="body1" sx={{minWidth: 50}}>{index + 1}</Typography>
                                    <Typography variant="body1" sx={{flexGrow: 1}}>{player.userName}</Typography>
                                    <LinearProgress variant="determinate" value={player.scorePercentage}
                                                    sx={{width: 125, marginLeft: 2, marginRight: 2}}/>
                                    <Typography variant="body2"
                                                sx={{minWidth: 50}}>{player.scorePercentage}%</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
});

export default GameProcess;
