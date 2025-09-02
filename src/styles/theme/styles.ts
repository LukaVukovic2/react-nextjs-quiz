import { defineGlobalStyles } from "@chakra-ui/react";
export const globalCss = defineGlobalStyles({
  body: {
    fontFamily: "{fonts.body}",
    minHeight: "100vh",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
  },

  main: {
    flex: 1,
    margin: "0 auto",
    maxWidth: "1000px",
    width: "100%",
    display: "flex",
    flexDir: "column"
  },

  "main > *": {
    padding: "var(--chakra-spacing-3)"
  }
});
