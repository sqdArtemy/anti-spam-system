import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import {observer} from "mobx-react";
import {autorun} from "mobx";
import analysisStore from "../../stores/AnalysisStore";
import {SentimentAnalysis} from "../../api/interfaces/responses/analysis.ts"; // Ensure this import path is correct

interface ImportantWords {
    [key: string]: number;
}

const SpamDetector = observer(() => {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        const disposer = autorun(() => {
            if (analysisStore.state === "error") {
                alert("Error: " + analysisStore.errorMessage); // Handle errors
            } else if (analysisStore.state === "success") {
                console.log("Analysis success:", analysisStore._analysisData);
            } else if (analysisStore.state === "loading") {
                console.log("Analysis in progress...");
            }
        });

        return () => disposer();
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        if (newText.split(/\s+/).filter(Boolean).length > 1000) return;
        setText(newText);
        setWordCount(newText.split(/\s+/).filter(Boolean).length);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setWordCount(0);
        }
    };

    const handlePasteText = () => {
        navigator.clipboard.readText().then((text) => {
            setText(text);
            setWordCount(text.split(/\s+/).filter(Boolean).length);
        });
    };

    const handleCheckClick = () => {
        if (analysisStore.state === "loading") return;
        if (!text && !image) return alert("Please enter some text or upload an image.");

        analysisStore.analyze(text, image, wordCount.toString());
    };

    const getProgressColor = (confidence: number) => {
        if (confidence > 80) return "#d32f2f";
        if (confidence > 50) return "#fbc02d";
        return "#388e3c";
    };

    const confidence = analysisStore.state === "success"
        ? analysisStore._analysisData.output.confidence
        : 0;

    const highlightText = (inputText: string, importantWords: ImportantWords) => {
        const regex = new RegExp(`\\b(${Object.keys(importantWords).join("|")})\\b`, "gi");

        return inputText.split(regex).map((part, index) => {
            if (importantWords[part.toLowerCase()]) {
                return (
                    <span key={index} style={{backgroundColor: "yellow", fontWeight: "bold"}}>
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    const importantWords = analysisStore.state === "success"
        ? analysisStore._analysisData.output.importantWords
        : {};

    return (
        <Box sx={{display: "flex", justifyContent: "center", p: 4, minHeight: "100%"}}>
            <Box sx={{width: "100%", maxWidth: 1200, display: "flex", flexDirection: "column", position: "relative"}}>
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{textAlign: "left", margin: 0}}>
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
                            height: "auto",
                        }}
                    >
                        {imagePreview && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 370,
                                    marginBottom: 2,
                                }}
                            >
                                <img
                                    src={imagePreview}
                                    alt="Uploaded Preview"
                                    style={{maxHeight: "100%", maxWidth: "100%"}}
                                />
                            </Box>
                        )}

                        {analysisStore.state !== "success" && !imagePreview && (
                            <TextField
                                placeholder="Add text here..."
                                multiline
                                rows={12}
                                fullWidth
                                variant="outlined"
                                value={text}
                                onChange={handleTextChange}
                                sx={{
                                    height: 325,
                                    overflow: "auto",
                                }}
                            />
                        )}
                        {analysisStore.state === "success" && !imagePreview && (
                            <Box
                                sx={{
                                    mt: 2,
                                    whiteSpace: "pre-wrap",
                                    wordWrap: "break-word",
                                    wordBreak: "break-word",
                                    height: 325,
                                    overflowY: "auto",
                                }}
                            >
                                {highlightText(text, importantWords)}
                            </Box>
                        )}
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                            gap: 20
                        }}>
                            {analysisStore.state !== "success" && (
                                <>
                                    <Button
                                        startIcon={<ContentPasteIcon/>}
                                        variant="outlined"
                                        color="primary"
                                        onClick={handlePasteText}
                                        fullWidth
                                    >
                                        Paste Text
                                    </Button>
                                    <Button
                                        startIcon={<FileUploadIcon/>}
                                        variant="outlined"
                                        color="primary"
                                        component="label"
                                        fullWidth
                                    >
                                        Upload Image
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </Button>
                                </>
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{textAlign: "right", mt: 2}}>
                            Word Count: {wordCount}/1000
                        </Typography>
                    </Paper>

                    {/* Second Paper Component */}
                    <Paper elevation={3}
                           sx={{flex: 1, p: 3, display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Typography variant="h5" fontWeight="bold" sx={{mb: 3, display: "flex", alignItems: "center"}}>
                            Likelihood of Spam:
                        </Typography>

                        {analysisStore.state === "loading" ? (
                            <CircularProgress/>
                        ) : analysisStore.state === "error" ? (
                            <Typography variant="body2">Error occurred. Try again.</Typography>
                        ) : (
                            <Box sx={{
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                                width: "100%",
                                height: "100%"
                            }}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        mb: 4,
                                    }}
                                >
                                    <CircularProgress
                                        variant="determinate"
                                        value={confidence}
                                        size={250}
                                        sx={{
                                            color: getProgressColor(confidence),
                                        }}
                                    />
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            position: "absolute",
                                            fontWeight: "bold",
                                            color: getProgressColor(confidence),
                                            fontSize: "3rem",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    >
                                        {confidence.toFixed(2)}%
                                    </Typography>
                                </Box>

                                {analysisStore.state === "success" && (
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            px: 4,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                sx={{whiteSpace: "nowrap"}}
                                            >
                                                Sentiment: {(analysisStore._analysisData.output.sentiment as SentimentAnalysis).label}
                                            </Typography>
                                            <Box sx={{flex: 1, ml: 2}}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            flex: 1,
                                                            height: 10,
                                                            bgcolor: "#e0e0e0",
                                                            borderRadius: 2,
                                                            position: "relative",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: `${(analysisStore._analysisData.output.sentiment as SentimentAnalysis).score * 100}%`,
                                                                height: "100%",
                                                                bgcolor: getProgressColor(
                                                                    (analysisStore._analysisData.output.sentiment as SentimentAnalysis).score * 100
                                                                ),
                                                            }}
                                                        />

                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight="bold"
                                                        color="text.secondary"
                                                    >
                                                        {(
                                                            (analysisStore._analysisData.output.sentiment as SentimentAnalysis).score *
                                                            100
                                                        ).toFixed(2)}
                                                        %
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Paper>
                </Box>

                {/* Action Buttons */}
                <Box sx={{display: "flex", justifyContent: "flex-end", bottom: 0, right: 0, marginTop: "1.5rem"}}>
                    {analysisStore.state !== "success" && (
                        <Button
                            variant="contained"
                            sx={{
                                px: 4,
                                backgroundColor: "#0046d5",
                                "&:hover": {
                                    backgroundColor: "#0039b3",
                                },
                                width: "200px",
                            }}
                            onClick={handleCheckClick}
                            disabled={analysisStore.state === "loading"}
                        >
                            {analysisStore.state === "loading" ? "Checking..." : "Check"}
                        </Button>
                    )}
                    {analysisStore.state === "success" && (
                        <Button
                            variant="contained"
                            sx={{
                                px: 4,
                                backgroundColor: "#808080",
                                "&:hover": {
                                    backgroundColor: "#606060",
                                },
                                width: "200px",
                            }}
                            onClick={() => {
                                analysisStore.reset()
                                setImage(null)
                                setImagePreview(null)
                                setText("")
                                setWordCount(0)
                            }}
                        >
                            Restart
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
});

export default SpamDetector;
