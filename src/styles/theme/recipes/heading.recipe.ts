import { defineRecipe } from "@chakra-ui/react";

const headingRecipe = defineRecipe({
  base: {
    fontWeight: "bold",
    color: "dark.400",
    fontFamily: "heading",
  },
  variants: {
    visual: {
      reversed: {
        color: "light.200",
        bg: "dark.400",
      }
    },
    size: {
      h1: {
        fontSize: "4xl",
        lineHeight: "1.1",
        margin: "{spacing.4} 0"
      },
      h2: {
        fontSize: "3xl",
        lineHeight: "1.15",
        margin: "{spacing.3} 0"
      },
      h3: {
        fontSize: "2xl",
        lineHeight: "1.2",
        margin: "{spacing.2} 0"
      },
      h4: {
        fontSize: "xl",
        lineHeight: "1.25",
        margin: "{spacing.2} 0"
      },
      h5: {
        fontSize: "lg",
        lineHeight: "1.3",
        margin: "{spacing.2} 0"
      },
      h6: {
        fontSize: "md",
        lineHeight: "1.35",
        margin: "{spacing.2} 0"
      }
    }
  },
});

export default headingRecipe;