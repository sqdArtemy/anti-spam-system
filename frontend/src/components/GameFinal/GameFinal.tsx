import {useEffect} from 'react';
import {observer} from 'mobx-react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Card,
    CardContent,
    List,
    ListItem,
    LinearProgress
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import gameStore from '../../stores/GameStore';
import {useNavigate} from "react-router-dom";

const GameFinal = observer(() => {
    const navigate = useNavigate();
    useEffect(() => {
        gameStore.finishState = 'pending';
        gameStore.currentState = 'pending';
        if (!gameStore.finishData) {
            console.error("No finish data available!");
        }

        if (!gameStore.leaderboard) {
            gameStore.getTopPlayers();
        }
    }, []);

    const renderTickCross = (humanAnswer: boolean, actualAnswer: boolean) => {
        return humanAnswer === actualAnswer ? <CheckIcon color="success"/> : <ClearIcon color="error"/>;
    };

    const handleFinish = () => {
        navigate('/main/game/start');
        gameStore.finishState = 'pending';
        gameStore.currentState = 'pending';
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                padding: 3,
                gap: '2rem',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50%',
                    maxHeight: '700px',
                    gap: '2rem',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <Typography variant="h5" fontWeight="bold">
                        Score: {gameStore.finishData?.score || 0}
                    </Typography>
                </Box>

                <TableContainer component={Paper} sx={{width: '100%'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>AI's Answer</TableCell>
                                <TableCell>Human Answer</TableCell>
                                <TableCell>Actual Answer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gameStore.data.checkRequests.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '2rem',
                                                width: '125px',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            {index + 1}
                                            {renderTickCross(gameStore.finishData?.data[index].userSus || false, row.actualSus)}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.aiSus ? 'SPAM' : 'NOT SPAM'}</TableCell>
                                    <TableCell>{gameStore.finishData?.data[index].userSus ? 'SPAM' : 'NOT SPAM'}</TableCell>
                                    <TableCell>{row.actualSus ? 'SPAM' : 'NOT SPAM'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '100%',
                    }}
                >
                    <Button variant="contained" color="success" sx={{width: '170px'}} onClick={handleFinish}>
                        FINISH
                    </Button>
                </Box>
            </Box>

            <Box
                sx={{
                    width: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        borderColor: 'gold',
                        width: '100%',
                        maxWidth: 450,
                        height: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingTop: '2rem',
                    }}
                >
                    <CardContent sx={{width: '100%'}}>
                        <Typography variant="h6" fontWeight="bold" sx={{textAlign: 'center'}}>
                            🏆 TOP 10 Players
                        </Typography>
                        <List sx={{width: '100%', padding: 0, marginTop: 3}}>
                            {gameStore.topPlayers?.map((player, index) => (
                                <ListItem
                                    key={`${player.userName}-${index}`}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px 0',
                                        justifyContent: 'center',
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
            </Box>
        </Box>
    );
});

export default GameFinal;
