import {Box, Typography, Button, Card, CardContent, List, ListItem, LinearProgress, Stack} from "@mui/material";

const GameStart = () => {
    const topPlayers = [
        {rank: 1, name: "Top G", accuracy: 95},
        {rank: 2, name: "PNG Lover", accuracy: 90},
        {rank: 3, name: "P Destroyer", accuracy: 87},
        {rank: 4, name: "Master", accuracy: 80},
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: 4,
            }}
        >

            <Stack
                direction={{xs: 'column', md: 'row'}}
                spacing={4}
                sx={{width: '100%', maxWidth: '1400px'}}
            >

                <Stack
                    direction={{xs: 'column', sm: 'row'}}
                    spacing={2}
                    sx={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}
                >
                    <Card variant="outlined" sx={{
                        borderColor: 'red',
                        width: '100%',
                        maxWidth: 500,
                        height: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        paddingTop: '2rem',

                    }}>
                        <CardContent>
                            <Typography variant="h6" color="error" fontWeight="bold" align="center">
                                Spam Letter
                            </Typography>
                            <Typography variant="body2" sx={{marginTop: 3}} align="center">
                                Dear Customer, Four your safety, your Apple ID has been disabled because some
                                information
                                appears to be missing or invalid. And it's against our policy terms of
                                service to give fake identity in your Apple account. Therefore, we need to
                                re-verify your account data.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Normal Letter */}
                    <Card variant="outlined" sx={{
                        borderColor: 'green',
                        width: '100%',
                        maxWidth: 500,
                        height: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        paddingTop: '2rem',
                    }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" align="center">
                                Normal Letter
                            </Typography>

                            <Typography variant="body2" sx={{marginTop: 3}} align="center">
                                Dear Customer, Four your safety, your Apple ID has been disabled because some
                                information
                                appears to be missing or invalid. And it's against our policy terms of
                                service to give fake identity in your Apple account. Therefore, we need to
                                re-verify your account data.
                            </Typography>
                        </CardContent>
                    </Card>
                </Stack>

                {/* Top Players */}
                <Card variant="outlined" sx={{
                    borderColor: 'gold',
                    width: '100%',
                    maxWidth: 400,
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: '2rem',
                }}>
                    <CardContent sx={{width: '100%'}}>
                        <Typography variant="h6" fontWeight="bold" sx={{textAlign: 'center'}}>
                            🏆 TOP 10 Players
                        </Typography>
                        <List sx={{width: '100%', padding: 0, marginTop: 3}}>
                            {topPlayers.map((player) => (
                                <ListItem
                                    key={player.rank}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px 0',
                                        justifyContent: 'center',
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
            </Stack>
            <Box sx={{textAlign: "center", marginTop: 4}}>
                <Button variant="contained" color="success" size="large" fullWidth sx={{
                    width: '300px'
                }}>
                    Start game
                </Button>
            </Box>
        </Box>
    );
};

export default GameStart;
