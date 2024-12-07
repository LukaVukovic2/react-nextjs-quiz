import { defineRecipe } from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  base: {
    padding: '{spacing.2} {spacing.5}',
    borderRadius: 'subtle',
    fontSize: 'fontSizes.md',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    transition: 'all 0.3s',
    zIndex: 10,
    whiteSpace: "normal",
    wordBreak: "break-word",
  },
  variants: {
    visual: {
      solid: { 
        bg: "dark.400", 
        color: "light.200",
        borderRadius: "soft",
        textTransform: "uppercase",
        _disabled: {
          bg: "dark.600",
          color: "light.600",
          cursor: "not-allowed"
        },
        _hover: {
          bg: "light.200",
          color: "dark.400",
          boxShadow: "0 0 5px {colors.dark.200}"
        }
      },
      outline: { 
        border: "1px solid {colors.dark.400}",
        color: "text.primary",
        fontSize: "sm",
        _disabled: {
          border: "1px solid {colors.text.tertiary}",
          color: "text.tertiary",
          cursor: "not-allowed"
        },
        _hover: {
          boxShadow: "0 0 5px {colors.text.tertiary}"
        }
      },
      ghost: {
        bg: "transparent",
        color: "text.primary",
        _disabled: {
          color: "text.tertiary",
          cursor: "not-allowed"
        },
        _hover: {
          textDecoration: "underline",
        }
      },
      success: {
        bg: "success.400",
        color: "light.200",
        boxShadow: "0 0 10px {colors.success.800} inset",
        _hover: {
          bg: "success.600"
        }
      },
      danger: {
        bg: "danger.200",
        color: "light.200",
        _hover: {
          bg: "danger.400"
        }
      }
    },
    size: {
      sm: {
        padding: "{spacing.1} {spacing.2}",
        fontSize: "xs"
      },
      md: {
        padding: "{spacing.2} {spacing.5}",
        fontSize: "md"
      },
      lg: {
        padding: "{spacing.3} {spacing.6}",
        fontSize: "xl"
      }
    }
  },
  defaultVariants: {
    visual: "solid",
    size: "md",
  }
});
export default buttonRecipe;