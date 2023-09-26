import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { useTernaryDarkMode } from "usehooks-ts";

const lightModeDesignTokens = {
  palette: {
    mode: "light",
    primary: {
      main: '#461eb7',
      hover: "rgba(70, 30, 183, 0.05)",
      active: "rgba(70, 30, 183, 0.15)",
    },
    divider: 'rgba(70, 30, 183, 0.16)'
  }
}

const darkModeDesignTokens = {
  palette: {
    mode: "dark",
    primary: {
      main: '#4985e2',
      hover: "rgba(73, 133, 226, 0.05)",
      active: "rgba(73, 133, 226, 0.15)",
    },
    divider: 'rgba(73, 133, 226, 0.12)'
  }
}

function createThemeSettings(mode) {
  const palette = mode === "light" ? lightModeDesignTokens : darkModeDesignTokens;

  return {
    ...palette,
    typography: {
      fontSize: 12,
      h1: {
        fontSize: "2.25rem",
      },
      h2: {
        fontSize: "1.625rem",
      },
      h3: {
        fontSize: "1.25rem",
      },
      button: {
        textTransform: 'none'
      }
    }
  };
}

export const useCreateTheme = () => {
  const { isDarkMode } = useTernaryDarkMode();
  const mode = isDarkMode ? 'dark' : 'light';
  const theme = useMemo(() => createTheme(createThemeSettings(mode)), [mode]);
  return theme;
};