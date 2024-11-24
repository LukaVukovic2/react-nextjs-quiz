import { defineTokens } from "@chakra-ui/react";

const colors = defineTokens.colors({
  primary: {value: "#DCF2F1"},
  secondary: {value: "#7FC7D9"},
  tertiary: {value: "#365486"},
  
  dark: {
    200: {value: "#1a1a1a"},
    400: {value: "#333333"},
    600: {value: "#4d4d4d"},
    800: {value: "#666666"}
  },
  light: {
    200:{value: "#f2f2f2"},
    400:{value: "#e6e6e6"},
    600:{value: "#d9d9d9"},
    800:{value: "#cccccc"}
  },
  text: {
    primary:{value: "#333333"},
    secondary:{value: "#666666"},
    tertiary:{value: "#999999"}
  },
  success: {
    200:{value: "#00ff00"},
    400:{value: "#00cc00"},
    600:{value: "#009900"},
    800:{value: "#006600"}
  },
  danger: {
    200: {value: "#ff0000"},
    400: {value: "#cc0000"},
    600: {value: "#990000"},
    800: {value: "#660000"}
  }
});

export default colors;