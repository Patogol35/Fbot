import {
    useState,
    useRef,
    useEffect,
} from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    CircularProgress,
    useMediaQuery,
    useTheme,
    Fade,
} from "@mui/material";

import {
    SendRounded,
    SmartToyRounded,
    DeleteOutlineRounded,
    LightModeRounded,
    DarkModeRounded,
} from "@mui/icons-material";

import "./Chat.css";

function Chat({
    darkMode,
    toggleDarkMode,
}) {
    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("md")
    );

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | SUGERENCIAS
    |--------------------------------------------------------------------------
    */

    const suggestions = [
        {
            label: "¿Quién es Jorge?",
            message: "¿Quién es Jorge?",
        },
        {
            label: "Educación de Jorge",
            message: "¿Cuál es la educación de Jorge?",
        },
        {
            label: "Proyectos de Jorge",
            message: "¿Qué proyectos tiene Jorge?",
        },
        {
            label: "Certificados de Jorge",
            message: "¿Cuál es la experiencia de Jorge?",
        },
    ];

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
    | SUGERENCIAS
    |--------------------------------------------------------------------------
    */

    const Suggestions = (
        <Box className="suggestions-container">

            {suggestions.map(
                (suggestion, index) => (

                    <button
                        key={index}
                        className="suggestion-button"
                        onClick={() =>
                            sendMessage(
                                suggestion.message
                            )
                        }
                        disabled={loading}
                    >
                        {suggestion.label}
                    </button>

                )
            )}

        </Box>
    );

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <Box className="chat-page">

            {/* CHAT PRINCIPAL */}

            <Box className="chat-main">

                {/* TOPBAR - SIEMPRE VISIBLE */}

                <Box className="chat-topbar">

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

                    {/* MODO CLARO / OSCURO */}

                    <IconButton
                        onClick={toggleDarkMode}
                        title={
                            darkMode
                                ? "Modo claro"
                                : "Modo oscuro"
                        }
                        className="theme-button"
                    >
                        {darkMode ? (
                            <LightModeRounded />
                        ) : (
                            <DarkModeRounded />
                        )}
                    </IconButton>

                    {/* NUEVA CONVERSACIÓN */}

                    <IconButton
                        onClick={newChat}
                        title="Nueva conversación"
                        disabled={loading}
                        className="new-chat-icon-button"
                    >
                        <DeleteOutlineRounded />
                    </IconButton>

                </Box>

                {/* CONTENIDO DEL CHAT */}

                <Box className="chat-content">

                    {/* -------------------------------------------------
                        BIENVENIDA
                    ------------------------------------------------- */}

                    {messages.length === 0 && (

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

                                    {/* SUGERENCIAS */}

                                    {Suggestions}

                                </Box>

                            </Fade>

                        </Box>

                    )}

                    {/* -------------------------------------------------
                        MENSAJES
                    ------------------------------------------------- */}

                    {messages.length > 0 && (

                        <Box className="messages-container">

                            <Box className="messages-list">

                                {/* SUGERENCIAS ARRIBA DEL CHAT */}

                                {Suggestions}

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

                    )}

                    {/* INPUT SIEMPRE ABAJO */}

                    {Input}

                </Box>

            </Box>

        </Box>
    );
}

export default Chat;
