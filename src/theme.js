import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { useLocalStorage } from "usehooks-ts";
import { useMediaQuery } from "@mui/material";
import { stringToColor } from "./utils/stringToColor";

const lightModeDesignTokens = {
  palette: {
    mode: "light",
    primary: {
      main: '#461eb7',
      hover: "rgba(70, 30, 183, 0.05)",
      active: "rgba(70, 30, 183, 0.15)",
    },
    text: {
      secondary: "rgba(0, 0, 0, 0.4)"
    }
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
    text: {
      secondary: "rgba(255, 255, 255, 0.4)"
    }
  }
}

function createThemeSettings(mode) {
  const palette = mode === "light" ? lightModeDesignTokens : darkModeDesignTokens;

  return {
    ...palette,
    components: {
      MuiStack: {
        defaultProps: {
          useFlexGap: true
        }
      }
    },
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
  const { isDarkMode } = useDarkMode();
  const mode = isDarkMode ? 'dark' : 'light';
  const theme = useMemo(() => createTheme(createThemeSettings(mode)), [mode]);
  return theme;
};

export function useDarkMode() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useLocalStorage('ason-dark-mode', 'system');
  
  let isDarkMode = darkMode === 'dark';
  if (darkMode === 'system') {
    isDarkMode = prefersDarkMode;
  }

  return {
    isDarkMode,
    setDarkMode
  }
}

export function useStringColor(s) {
  const {isDarkMode} = useDarkMode();

  const lightness = isDarkMode ? 70 : 40;
  return stringToColor(s, 90, lightness);
}