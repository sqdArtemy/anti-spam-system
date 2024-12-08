import {useEffect, useState} from 'react';
import {Box, Typography, Button, Card, CardContent, List, ListItem, LinearProgress, Stack} from "@mui/material";
import {observer} from 'mobx-react';
import gameStore from '../../stores/GameStore'; // Ensure the path to your GameStore is correct
import {autorun} from 'mobx';
import {ITopPlayer} from "../../api/interfaces/responses/game.ts";
import {useNavigate} from "react-router-dom";

const GameStart = observer(() => {
    const [gameStarted, setGameStarted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        gameStore.getTopPlayers();
        autorun(() => {
            console.log("Game Store State: ", gameStore.currentState);
            if (gameStore.state === 'success' && gameStore.data.gameId !== -1) {
                console.log("Game Initialized: ", gameStore.data.gameId);
                gameStore.currentState = 'pending';
                navigate('/main/game/process');
            } else if (gameStore.state === 'error') {
                console.error("Error: ", gameStore.errorMsg);
                gameStore.currentState = 'pending';
            }

            if (gameStore.topPlayersState === 'success') {
                console.log("Top Players: ", gameStore.topPlayers);
                gameStore.topPlayersState = 'pending';
            } else if (gameStore.topPlayersState === 'error') {
                console.error("Error: ", gameStore.errorMsg);
                gameStore.topPlayersState = 'pending';
            }


        });
    }, []);


    const handleStartButton = () => {
        setGameStarted(true);
    }

    const handleStartGame = (quantity: number) => {

        gameStore.initGame(quantity);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                padding: 4,
            }}
        >
            <Stack
                direction={{xs: "column", md: "row"}}
                spacing={4}
                sx={{width: "100%", maxWidth: "1400px"}}
            >
                {/* Spam and Normal Letter Cards */}
                <Stack
                    direction={{xs: "column", sm: "row"}}
                    spacing={2}
                    sx={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* Spam Letter Card */}
                    <Card
                        variant="outlined"
                        sx={{
                            borderColor: "red",
                            width: "100%",
                            maxWidth: 500,
                            height: "550px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            paddingTop: "2rem",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" color="error" fontWeight="bold" align="center">
                                Spam Letter
                            </Typography>
                            <Typography variant="body2" sx={{marginTop: 3}} align="center">
                                Dear Customer, For your safety, your Apple ID has been disabled because some
                                information appears to be missing or invalid. And it's against our policy
                                terms of service to give fake identity in your Apple account. Therefore, we
                                need to re-verify your account data.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Normal Letter Card */}
                    <Card
                        variant="outlined"
                        sx={{
                            borderColor: "green",
                            width: "100%",
                            maxWidth: 500,
                            height: "550px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            paddingTop: "2rem",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" align="center">
                                Normal Letter
                            </Typography>
                            <Typography variant="body2" sx={{marginTop: 3}} align="center">
                                Dear Customer, For your safety, your Apple ID has been disabled because some
                                information appears to be missing or invalid. And it's against our policy
                                terms of service to give fake identity in your Apple account. Therefore, we
                                need to re-verify your account data.
                            </Typography>
                        </CardContent>
                    </Card>
                </Stack>

                <Card
                    variant="outlined"
                    sx={{
                        borderColor: "gold",
                        width: "100%",
                        maxWidth: 450,
                        height: "550px",
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
                            {gameStore.topPlayers!.map((player: ITopPlayer, index) => (
                                <ListItem
                                    key={player.userName}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Typography variant="body1" sx={{minWidth: 50}}>
                                        {index + 1}
                                    </Typography>
                                    <Typography variant="body1" sx={{flexGrow: 1}}>
                                        {player.userName}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={player.scorePercentage}
                                        sx={{width: 125, marginLeft: 2, marginRight: 2}}
                                    />
                                    <Typography variant="body2" sx={{minWidth: 50}}>
                                        {player.scorePercentage}%
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Stack>

            {/* Start Game Button */}
            <Box sx={{textAlign: "center", marginTop: 4}}>
                {!gameStarted ? (
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        fullWidth
                        sx={{width: "300px"}}
                        onClick={() => handleStartButton()} // Example: start game with 5 letters
                    >
                        Start game
                    </Button>
                ) : (
                    <Stack direction="row" spacing={2} sx={{justifyContent: "center", width: "500px"}}>
                        <Button variant="contained" color="success" size="large" fullWidth
                                onClick={() => handleStartGame(5)}>
                            5 Letters
                        </Button>
                        <Button variant="contained" color="warning" size="large" fullWidth
                                onClick={() => handleStartGame(10)}>
                            10 Letters
                        </Button>
                        <Button variant="contained" color="error" size="large" fullWidth
                                onClick={() => handleStartGame(15)}>
                            15 Letters
                        </Button>
                    </Stack>
                )}
            </Box>
        </Box>
    );
});

export default GameStart;
