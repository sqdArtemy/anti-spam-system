import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

const SpamDetector = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                p: 4,
                minHeight: "100%",
            }}
        >

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        textAlign: "left",
                    }}
                >
                    Spam Detector
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {xs: "column", md: "row"},
                        gap: 2,
                        mt: 4,
                        width: "100%",
                    }}
                >

                    <Paper
                        elevation={3}
                        sx={{
                            flex: 1,
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <TextField
                            placeholder="Add text here..."
                            multiline
                            rows={12}
                            fullWidth
                            variant="outlined"
                        />
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 2,
                            }}
                        >
                            <Button
                                startIcon={<ContentPasteIcon/>}
                                variant="outlined"
                                color="primary"
                            >
                                Paste Text
                            </Button>
                            <Button
                                startIcon={<FileUploadIcon/>}
                                variant="outlined"
                                color="primary"
                            >
                                Upload Image
                            </Button>
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{textAlign: "right", mt: 2}}
                        >
                            Word Count: 0/1000
                        </Typography>
                    </Paper>


                    <Paper
                        elevation={3}
                        sx={{
                            flex: 1,
                            p: 3,
                        }}
                    >
                        <Typography variant="body1" fontWeight="bold" sx={{mb: 2}}>
                            Likelihood of spam:
                        </Typography>
                        <Typography variant="body2" sx={{mb: 2}}>
                            List
                        </Typography>
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                p: 2,
                                height: "180px",
                                overflowY: "auto",
                            }}
                        />
                    </Paper>
                </Box>


                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",

                        bottom: 0,
                        right: 0,
                        p: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            px: 4,
                            backgroundColor: "#0046d5",
                            "&:hover": {
                                backgroundColor: "#0039b3",
                            },
                            width: "200px"
                        }}
                    >
                        Check
                    </Button>
                </Box>
            </Box>
        </Box>

    );
};

export default SpamDetector;
