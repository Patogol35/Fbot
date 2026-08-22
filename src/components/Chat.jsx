import { useState, useRef, useEffect } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    Divider,
    Chip,
    CircularProgress,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
    Fade,
} from "@mui/material";

import {
    SendRounded,
    SmartToyRounded,
    AddRounded,
    MenuRounded,
    DeleteOutlineRounded,
    AutoAwesomeRounded,
    CodeRounded,
    LightbulbOutlined,
    CloseRounded,
} from "@mui/icons-material";

import "./Chat.css";

function Chat() {

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, loading]);

    const sendMessage = async (text = message) => {

        if (!text.trim() || loading) {
            return;
        }

        const userMessage = text.trim();

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage
            }
        ]);

        setMessage("");
        setLoading(true);

        try {

            const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/chat`,
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: userMessage
        })
    }
);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Error del servidor"
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response
                }
            ]);

        } catch (error) {

            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "No pude conectarme con el servidor. Verifica que el backend esté ejecutándose."
                }
            ]);

        } finally {

            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            sendMessage();
        }
    };

    const newChat = () => {

        setMessages([]);
        setMessage("");

        if (isMobile) {
            setDrawerOpen(false);
        }
    };

    const suggestions = [
        {
            icon: <LightbulbOutlined />,
            text: "Dame una idea de proyecto"
        },
        {
            icon: <CodeRounded />,
            text: "Explícame JavaScript"
        },
        {
            icon: <AutoAwesomeRounded />,
            text: "¿Qué puedes hacer?"
        }
    ];

    return (
        <Box className="chat-page">

            {/* SIDEBAR */}

            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? drawerOpen : true}
                onClose={() => setDrawerOpen(false)}
                className="chat-drawer"
            >

                <Box className="sidebar">

                    <Box className="sidebar-logo">

                        <Avatar className="sidebar-avatar">
                            <SmartToyRounded />
                        </Avatar>

                        <Box>
                            <Typography
                                fontWeight={700}
                                fontSize={16}
                            >
                                AI Assistant
                            </Typography>

                            <Typography
                                fontSize={12}
                                color="text.secondary"
                            >
                                Gemini AI
                            </Typography>
                        </Box>

                    </Box>

                    <button
                        className="new-chat-button"
                        onClick={newChat}
                    >
                        <AddRounded />

                        Nueva conversación
                    </button>

                    <Typography
                        className="sidebar-section-title"
                    >
                        ASISTENTE
                    </Typography>

                    <List>

                        <ListItemButton
                            selected
                            onClick={newChat}
                        >
                            <ListItemIcon>
                                <SmartToyRounded />
                            </ListItemIcon>

                            <ListItemText
                                primary="Chat"
                            />
                        </ListItemButton>

                    </List>

                    <Box className="sidebar-bottom">

                        <Divider />

                        <Box className="sidebar-status">

                            <span className="online-dot" />

                            <Box>
                                <Typography
                                    fontSize={13}
                                    fontWeight={600}
                                >
                                    IA conectada
                                </Typography>

                                <Typography
                                    fontSize={11}
                                    color="text.secondary"
                                >
                                    Gemini API
                                </Typography>
                            </Box>

                        </Box>

                    </Box>

                </Box>

            </Drawer>

            {/* CONTENIDO PRINCIPAL */}

            <Box className="chat-main">

                {/* HEADER */}

                <Box className="chat-topbar">

                    {isMobile && (
                        <IconButton
                            onClick={() =>
                                setDrawerOpen(true)
                            }
                        >
                            <MenuRounded />
                        </IconButton>
                    )}

                    <Box className="topbar-info">

                        <Avatar className="topbar-avatar">
                            <SmartToyRounded />
                        </Avatar>

                        <Box>

                            <Typography
                                fontWeight={700}
                                fontSize={15}
                            >
                                AI Assistant
                            </Typography>

                            <Box className="online-status">

                                <span className="online-dot" />

                                <Typography
                                    fontSize={11}
                                    color="text.secondary"
                                >
                                    En línea
                                </Typography>

                            </Box>

                        </Box>

                    </Box>

                    <Box sx={{ marginLeft: "auto" }}>

                        <IconButton
                            onClick={newChat}
                            title="Nueva conversación"
                        >
                            <DeleteOutlineRounded />
                        </IconButton>

                    </Box>

                </Box>

                {/* MENSAJES */}

                <Box className="messages-container">

                    {messages.length === 0 ? (

                        <Fade in>

                            <Box className="welcome-container">

                                <Box className="welcome-icon-container">

                                    <SmartToyRounded />

                                </Box>

                                <Typography
                                    variant="h4"
                                    fontWeight={800}
                                    className="welcome-title"
                                >
                                    ¿En qué puedo ayudarte?
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    className="welcome-description"
                                >
                                    Soy un asistente impulsado por
                                    inteligencia artificial.
                                    Pregúntame lo que quieras.
                                </Typography>

                                <Box className="suggestions">

                                    {suggestions.map(
                                        (suggestion, index) => (

                                            <Chip
                                                key={index}
                                                icon={suggestion.icon}
                                                label={suggestion.text}
                                                onClick={() =>
                                                    sendMessage(
                                                        suggestion.text
                                                    )
                                                }
                                                className="suggestion-chip"
                                            />

                                        )
                                    )}

                                </Box>

                            </Box>

                        </Fade>

                    ) : (

                        <Box className="messages-list">

                            {messages.map(
                                (msg, index) => (

                                    <Box
                                        key={index}
                                        className={`message-row ${msg.role}`}
                                    >

                                        {msg.role ===
                                            "assistant" && (

                                            <Avatar className="message-avatar">
                                                <SmartToyRounded />
                                            </Avatar>

                                        )}

                                        <Box className="message-content">

                                            <Typography
                                                className="message-name"
                                            >
                                                {msg.role ===
                                                "user"
                                                    ? "Tú"
                                                    : "AI Assistant"}
                                            </Typography>

                                            <Paper
                                                elevation={0}
                                                className={`message-bubble ${msg.role}`}
                                            >
                                                <Typography
                                                    className="message-text"
                                                >
                                                    {msg.content}
                                                </Typography>
                                            </Paper>

                                        </Box>

                                    </Box>

                                )
                            )}

                            {loading && (

                                <Box className="message-row assistant">

                                    <Avatar className="message-avatar">
                                        <SmartToyRounded />
                                    </Avatar>

                                    <Box className="message-content">

                                        <Typography
                                            className="message-name"
                                        >
                                            AI Assistant
                                        </Typography>

                                        <Paper
                                            elevation={0}
                                            className="message-bubble assistant typing-bubble"
                                        >
                                            <Box className="typing">

                                                <span />
                                                <span />
                                                <span />

                                            </Box>

                                        </Paper>

                                    </Box>

                                </Box>

                            )}

                            <div ref={messagesEndRef} />

                        </Box>

                    )}

                </Box>

                {/* INPUT */}

                <Box className="input-area">

                    <Box className="input-wrapper">

                        <TextField
                            fullWidth
                            multiline
                            maxRows={5}
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe un mensaje..."
                            disabled={loading}
                            variant="outlined"
                            className="chat-input"
                        />

                        <IconButton
                            onClick={() => sendMessage()}
                            disabled={
                                !message.trim() ||
                                loading
                            }
                            className="send-button"
                        >
                            {loading ? (
                                <CircularProgress
                                    size={21}
                                    color="inherit"
                                />
                            ) : (
                                <SendRounded />
                            )}
                        </IconButton>

                    </Box>

                    <Typography className="input-disclaimer">
                        La IA puede cometer errores. Verifica la
                        información importante.
                    </Typography>

                </Box>

            </Box>

        </Box>
    );
}

export default Chat;
