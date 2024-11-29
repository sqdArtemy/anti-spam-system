import {useState} from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    LinearProgress,
    Stack,
    Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

const GameProcess = () => {
    const [score, setScore] = useState(3); // Current score
    const [time, setTime] = useState("00:43"); // Timer
    const [correctlyIdentified, setCorrectlyIdentified] = useState([]); // Array to track correct/incorrect answers
    const totalLetters = 15; // Total number of letters in the game (as shown in the image)

    const topPlayers = [
        {rank: 1, name: "Top G", accuracy: 95},
        {rank: 2, name: "PNG Lover", accuracy: 90},
        {rank: 3, name: "P Destroyer", accuracy: 87},
        {rank: 4, name: "Master", accuracy: 80},
    ];

    const handleSpam = () => {
        console.log("Spam button clicked!");
        // Logic to handle "Spam" action here
    };

    const handleNotSpam = () => {
        console.log("Not Spam button clicked!");
        // Logic to handle "Not Spam" action here
    };

    const renderTickCross = (isCorrect: boolean) => {
        return isCorrect ? <CheckIcon color="success"/> : <ClearIcon color="error"/>;
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                height: "100%",
                padding: '2rem 4rem'
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: '0.5rem'
                }}
            >
                <Box
                    sx={{
                        flex: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 4,
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "600px",
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Score: {score}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            Time: {time}
                        </Typography>
                    </Box>


                    <Box
                        sx={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: 4,
                            backgroundColor: "white",
                            width: "100%",
                            maxWidth: "600px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            height: "550px",
                        }}
                    >
                        <Typography variant="body1">
                            Dear Customer, For your safety, your Apple ID has been disabled
                            because some information appears to be missing or invalid. And it's
                            against our policy terms of service to give fake identity in your
                            Apple account. Therefore, we need to re-verify your account data.
                        </Typography>
                    </Box>


                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{marginTop: 4, justifyContent: "center"}}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            onClick={handleSpam}
                        >
                            SPAM
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={handleNotSpam}
                        >
                            NOT SPAM
                        </Button>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxWidth: "600px",
                        overflowY: "auto",
                    }}
                >

                    <Paper
                        sx={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: 2,
                            backgroundColor: "white",
                            width: "100%",
                            maxWidth: "600px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            maxHeight: "max-content",
                        }}
                    >
                        {Array.from({length: totalLetters}, (_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 2,
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Typography variant="body2" sx={{width: "30px", textAlign: "center"}}>
                                    {index + 1}
                                </Typography>
                                <Box sx={{display: "flex", alignItems: "center", marginLeft: 2}}>
                                    {renderTickCross(correctlyIdentified[index])}
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                </Box>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: 4,
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        borderColor: "gold",
                        width: "100%",
                        maxWidth: 400,
                        height: '600px',
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        paddingTop: "2rem",
                    }}
                >
                    <CardContent sx={{width: "100%"}}>
                        <Typography variant="h6" fontWeight="bold" sx={{textAlign: "center"}}>
                            🏆 TOP 10 Players
                        </Typography>
                        <List sx={{width: "100%", padding: 0, marginTop: 3}}>
                            {topPlayers.map((player) => (
                                <ListItem
                                    key={player.rank}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Typography variant="body1" sx={{minWidth: 50}}>
                                        {player.rank}st
                                    </Typography>
                                    <Typography variant="body1" sx={{flexGrow: 1}}>
                                        {player.name}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={player.accuracy}
                                        sx={{width: 125, marginLeft: 2, marginRight: 2}}
                                    />
                                    <Typography variant="body2" sx={{minWidth: 50}}>
                                        {player.accuracy}%
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default GameProcess;
