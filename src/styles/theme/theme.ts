import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { fonts } from "./foundations/fonts";
import { fontWeights } from "./foundations/font-weights";
import { fontSizes } from "./foundations/font-sizes";
import colors from "./foundations/colors";
import breakpoints from "./foundations/breakpoints";
import { spacing } from "./foundations/spacing";
import { radii } from "./foundations/radii";
import { globalCss } from "./styles";
import { recipes } from "./recipes";

const customConfig = defineConfig({
  globalCss,
  theme: {
    recipes,
    breakpoints,
    tokens: {
      colors,
      fonts,
      fontWeights,
      fontSizes,
      spacing,
      radii
    }
  },
});

export const system = createSystem(defaultConfig, customConfig);
 