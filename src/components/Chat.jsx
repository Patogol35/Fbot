import { useState, useRef, useEffect } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    Divider,
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

    /*
    |--------------------------------------------------------------------------
    | AUTO SCROLL
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    /*
    |--------------------------------------------------------------------------
    | ENVIAR MENSAJE
    |--------------------------------------------------------------------------
    */

    const sendMessage = async (text = message) => {
        if (!text.trim() || loading) return;

        const userMessage = text.trim();

        /*
        |--------------------------------------------------------------------------
        | HISTORIAL ANTERIOR
        |--------------------------------------------------------------------------
        */

        const previousHistory = messages
    .filter(
        (msg) =>
            msg.role === "user" ||
            msg.role === "assistant"
    )
    .slice(-12)
    .map((msg) => ({
        role: msg.role,
        content: msg.content,
    }));

        /*
        |--------------------------------------------------------------------------
        | MOSTRAR MENSAJE DEL USUARIO
        |--------------------------------------------------------------------------
        */

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/chat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        message: userMessage,
                        history: previousHistory,
                    }),
                }
            );

            let data;

            try {
                data = await response.json();
            } catch {
                throw new Error(
                    "El servidor devolvió una respuesta inválida."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Error del servidor."
                );
            }

            /*
            |--------------------------------------------------------------------------
            | RESPUESTA DE SASHA
            |--------------------------------------------------------------------------
            */

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        data.response ||
                        "No recibí una respuesta válida.",
                },
            ]);

        } catch (error) {

            console.error(
                "❌ Error enviando mensaje:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        error.message ||
                        "No pude conectarme con Sasha. Verifica que el backend esté disponible.",
                },
            ]);

        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | ENTER PARA ENVIAR
    |--------------------------------------------------------------------------
    */

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            sendMessage();
        }
    };

    /*
    |--------------------------------------------------------------------------
    | NUEVA CONVERSACIÓN
    |--------------------------------------------------------------------------
    */

    const newChat = () => {
        if (loading) return;

        setMessages([]);
        setMessage("");

        if (isMobile) {
            setDrawerOpen(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | INPUT
    |--------------------------------------------------------------------------
    */

    const Input = (
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
                    inputProps={{
                        maxLength: 1500,
                    }}
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
                            size={20}
                            color="inherit"
                        />
                    ) : (
                        <SendRounded />
                    )}
                </IconButton>

            </Box>

            <Typography className="input-disclaimer">
                Sasha utiliza inteligencia artificial.
                Puede cometer errores; verifica la información importante.
            </Typography>

        </Box>
    );

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <Box className="chat-page">

            {/* SIDEBAR */}

            <Drawer
                variant={
                    isMobile
                        ? "temporary"
                        : "permanent"
                }
                open={
                    isMobile
                        ? drawerOpen
                        : true
                }
                onClose={() =>
                    setDrawerOpen(false)
                }
                className="chat-drawer"
            >

                <Box className="sidebar">

                    {/* LOGO */}

                    <Box className="sidebar-logo">

                        <Avatar className="sidebar-avatar">
                            <SmartToyRounded />
                        </Avatar>

                        <Box>

                            <Typography
                                fontWeight={700}
                                fontSize={16}
                            >
                                Sasha AI
                            </Typography>

                            <Typography
                                fontSize={12}
                                color="text.secondary"
                            >
                                Groq · GPT-OSS 20B
                            </Typography>

                        </Box>

                    </Box>

                    {/* NUEVA CONVERSACIÓN */}

                    <button
                        className="new-chat-button"
                        onClick={newChat}
                        disabled={loading}
                    >
                        <AddRounded />

                        Nueva conversación
                    </button>

                    <Typography className="sidebar-section-title">
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
                                primary="Sasha"
                            />

                        </ListItemButton>

                    </List>

                    {/* ESTADO */}

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
                                    Groq API
                                </Typography>

                            </Box>

                        </Box>

                    </Box>

                </Box>

            </Drawer>

            {/* CHAT */}

            <Box className="chat-main">

                {/* TOPBAR */}

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
                                Sasha
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

                    {/* NUEVA CONVERSACIÓN */}

                    <IconButton
                        onClick={newChat}
                        title="Nueva conversación"
                        disabled={loading}
                        sx={{
                            marginLeft: "auto",
                        }}
                    >
                        <DeleteOutlineRounded />
                    </IconButton>

                </Box>

                {/* CONTENIDO */}

                {messages.length === 0 ? (

                    <Box className="empty-chat">

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
                                    Soy Sasha, el asistente de
                                    inteligencia artificial del
                                    portfolio de Jorge.
                                </Typography>

                                {Input}

                            </Box>

                        </Fade>

                    </Box>

                ) : (

                    <>

                        {/* MENSAJES */}

                        <Box className="messages-container">

                            <Box className="messages-list">

                                {messages.map(
                                    (msg, index) => (

                                        <Box
                                            key={`${msg.role}-${index}`}
                                            className={`message-row ${msg.role}`}
                                        >

                                            {msg.role ===
                                                "assistant" && (
                                                <Avatar className="message-avatar">
                                                    <SmartToyRounded />
                                                </Avatar>
                                            )}

                                            <Box className="message-content">

                                                <Typography className="message-name">

                                                    {msg.role ===
                                                    "user"
                                                        ? "Tú"
                                                        : "Sasha"}

                                                </Typography>

                                                <Paper
                                                    elevation={0}
                                                    className={`message-bubble ${msg.role}`}
                                                >

                                                    <Typography className="message-text">
                                                        {msg.content}
                                                    </Typography>

                                                </Paper>

                                            </Box>

                                        </Box>

                                    )
                                )}

                                {/* TYPING */}

                                {loading && (

                                    <Box className="message-row assistant">

                                        <Avatar className="message-avatar">
                                            <SmartToyRounded />
                                        </Avatar>

                                        <Box className="message-content">

                                            <Typography className="message-name">
                                                Sasha
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

                        </Box>

                        {Input}

                    </>

                )}

            </Box>

        </Box>
    );
}

export default Chat;
