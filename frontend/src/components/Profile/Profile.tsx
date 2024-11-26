import {Avatar, Box, Typography, Paper, TextField, IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {stringAvatar} from "../../utils.ts";

const Profile = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
                minHeight: "100vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 4,
                }}
            >
                <Avatar
                    alt="Top G"

                    {...stringAvatar(
                        `Test Test`, {
                            width: 100,
                            height: 100,
                            mb: 2,
                        }
                    )}
                />
                <Typography variant="h5" fontWeight="bold">
                    Top G
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    top.g@gmail.com
                </Typography>
            </Box>

            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 600,
                    p: 5,
                    borderRadius: 3,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 3, textAlign: "center" }}
                >
                    Account data
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mb: 3,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Name
                    </Typography>
                    <TextField
                        variant="standard"
                        fullWidth
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Email
                        </Typography>
                        <TextField
                            variant="standard"
                            fullWidth
                        />
                    </Box>
                    <IconButton aria-label="edit email" sx={{ ml: 2 }}>
                        <EditIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" color="text.secondary">
                        Password
                    </Typography>
                    <TextField
                        variant="standard"
                        fullWidth
                    />
                </Box>
            </Paper>

        </Box>
    );
};

export default Profile;
