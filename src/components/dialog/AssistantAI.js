import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import useAIChat from "../../hooks/Assistant/useAIChat";

const AssistantAI = ({ open, onClose, TaskInfo }) => {
  const apiEndpoint = "https://api.openai.com/v1/chat/completions";
  const apiKey = process.env.REACT_APP_OPEN_AI_KEY;
  const messagesEndRef = useRef(null);
  const { messages, sendMessage } = useAIChat(apiEndpoint, apiKey, TaskInfo);

  const [input, setInput] = useState("");
  const [typewrittenResponse, setTypewrittenResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typewrittenResponse]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      setIsTyping(true);
      const botResponse = await sendMessage(input);
      setInput("");
      setTypewrittenResponse("");

      for (let i = 0; i < botResponse.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        setTypewrittenResponse((prev) => prev + botResponse[i]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Fade}
      transitionDuration={300}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg, #25283d 0%, #464966 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 2,
        }}
      >
        <SmartToyIcon sx={{ fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>
          CheckMate - Asistente Virtual
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
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
                      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") 
                      .replace(/\n/g, "<br>"), 
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
                      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") 
                      .replace(/\n/g, "<br>"), 
                  }}
                ></Typography>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
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
            onKeyPress={handleKeyPress}
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
