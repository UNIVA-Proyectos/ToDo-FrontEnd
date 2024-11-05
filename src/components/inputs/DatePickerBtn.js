import { useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, TextField } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

const DatePickerBtn = ({ handleSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const elegantTheme = createTheme({
    palette: {
      primary: {
        main: "#ffc247",
        contrastText: "#ffffff", // Texto blanco para mayor legibilidad
      },
      secondary: {
        main: "#ffc247", // Un color secundario complementario
      },
    },
    components: {
      MuiPickersDay: {
        // Estilos para los días del calendario
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#ffc247", // Color al pasar el ratón
            },
            "&.Mui-selected": {
              backgroundColor: "#ffc247", // Color cuando el día está seleccionado
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#ffc247", // Al pasar el ratón en un día seleccionado
              },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "8px", // Bordes más redondeados
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#25283d",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#EBECEC", // Color de borde al enfocar
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            border: "1px solid #ffc247", // Borde del calendario
            borderRadius: "16px", // Bordes redondeados
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#ffc247",
          },
        },
      },
    },
  });

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    handleSelectDate(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={elegantTheme}>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default DatePickerBtn;
