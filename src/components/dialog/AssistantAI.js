import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useAIChat from "../../hooks/Assistant/useAIChat";

const AssistantAI = ({ open, onClose, TaskInfo }) => {
  const apiEndpoint = "https://api.openai.com/v1/chat/completions";
  const apiKey = process.env.REACT_APP_OPEN_AI_KEY;

  const { messages, sendMessage } = useAIChat(apiEndpoint, apiKey, TaskInfo);

  const [input, setInput] = useState("");
  const [typewrittenResponse, setTypewrittenResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    //no hay respuesta
    const botResponse = await sendMessage(input);

    // ya hay respuesta

    setIsTyping(true);

    setInput("");
    setTypewrittenResponse("");

    for (let i = 0; i < botResponse.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20)); // Controlar velocidad
      setTypewrittenResponse((prev) => prev + botResponse[i]);
    }
    setIsTyping(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          backgroundColor: "#F9F7F3",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "80vh",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#25283d" }}>
          CheckMate - Asistente Virtualb
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            color: "#25283d",
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: "400px",
            overflowY: "auto",
            padding: 2,
            background: "#f9f9f9",
            borderRadius: "8px",
            minHeight: "400px",
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                alignSelf:
                  message.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
                background: message.sender === "user" ? "#ffffff" : "#FFC247",
                color: message.sender === "user" ? "#25283d" : "#000000",
                padding: 1.5,
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                textAlign: message.sender === "user" ? "right" : "left",
              }}
            >
              {message.sender === "user" ? (
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#25283d",
                  }}
                >
                  Tú
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#25283d",
                  }}
                >
                  🤖CheckMate
                </Typography>
              )}

              {isTyping &&
              message.sender != "user" &&
              messages.length - 1 === index ? (
                <Typography
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: typewrittenResponse
                      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Negritas
                      .replace(/\n/g, "<br>"), // Saltos de línea
                  }}
                ></Typography>
              ) : (
                <Typography
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: message.text
                      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Negritas
                      .replace(/\n/g, "<br>"), // Saltos de línea
                  }}
                ></Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Campo de entrada y botón */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginTop: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Escribe tu mensaje aquí..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ borderRadius: "8px" }}
          />
          <Button
            variant="contained"
            sx={{
              background: "#25283D",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              px: 3,
              py: 1,
              "&:hover": {
                background: "linear-gradient(to left, #2196f3, #e91e63)",
              },
            }}
            onClick={handleSend}
          >
            Enviar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AssistantAI;
