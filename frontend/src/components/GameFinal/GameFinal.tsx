import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    LinearProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

const topPlayers = [
    {rank: 1, name: "Top G", accuracy: 95},
    {rank: 2, name: "PNG Lover", accuracy: 90},
    {rank: 3, name: "P Destroyer", accuracy: 87},
    {rank: 4, name: "Master", accuracy: 80},
];

const data = [
    {id: 1, letter: "Letter 1", model: "SPAM", user: "SPAM", correct: "SPAM"},
    {id: 2, letter: "Letter 2", model: "SPAM", user: "SPAM", correct: "SPAM"},
    {id: 3, letter: "Letter 3", model: "NOT SPAM", user: "SPAM", correct: "NOT SPAM"},
    {id: 4, letter: "Letter 4", model: "NOT SPAM", user: "NOT SPAM", correct: "NOT SPAM"},
    {id: 5, letter: "Letter 5", model: "SPAM", user: "NOT SPAM", correct: "SPAM"},
    {id: 6, letter: "Letter 6", model: "NOT SPAM", user: "NOT SPAM", correct: "NOT SPAM"},
    {id: 7, letter: "Letter 7", model: "SPAM", user: "NOT SPAM", correct: "SPAM"},
    {id: 8, letter: "Letter 8", model: "NOT SPAM", user: "NOT SPAM", correct: "NOT SPAM"},
    {id: 9, letter: "Letter 9", model: "SPAM", user: "SPAM", correct: "SPAM"},
    {id: 10, letter: "Letter 10", model: "NOT SPAM", user: "NOT SPAM", correct: "NOT SPAM"},
    {id: 11, letter: "Letter 11", model: "SPAM", user: "SPAM", correct: "SPAM"},
    {id: 12, letter: "Letter 12", model: "NOT SPAM", user: "NOT SPAM", correct: "NOT SPAM"},
    {id: 13, letter: "Letter 13", model: "NOT SPAM", user: "NOT SPAM", correct: "NOT SPAM"},
    {id: 14, letter: "Letter 14", model: "SPAM", user: "SPAM", correct: "SPAM"},
    {id: 15, letter: "Letter 15", model: "SPAM", user: "SPAM", correct: "SPAM"},
];

const GameFinal = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                height: "100%",
                padding: 3,
                gap: "2rem",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                    maxHeight: "700px",
                    gap: "2rem",
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <Typography variant="h5" fontWeight="bold">
                        Score: 9
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                        Time: 02:43
                    </Typography>
                </Box>


                <TableContainer component={Paper} sx={{width: "100%"}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Model's Answer</TableCell>
                                <TableCell>Your Answer</TableCell>
                                <TableCell>Correct Answer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Box sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: '2rem',
                                            width: '125px',
                                            justifyContent: 'space-between'
                                        }}>
                                            {row.letter}
                                            {row.user === row.correct ? (
                                                <CheckIcon sx={{color: "green", marginLeft: 1}}/>
                                            ) : (
                                                <ClearIcon sx={{color: "red", marginLeft: 1}}/>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.model}</TableCell>
                                    <TableCell>{row.user}</TableCell>
                                    <TableCell>{row.correct}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                </TableContainer>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",

                        width: "100%",
                    }}
                >
                    <Button variant="contained" color="success"
                            sx={{
                                width: "170px",
                            }}
                    >
                        FINISH
                    </Button>
                </Box>
            </Box>


            <Box
                sx={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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

export default GameFinal;
