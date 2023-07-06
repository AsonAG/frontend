import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          500: "#666666",
          700: "#3d3d3d",
        },
        primary: {
          100: "#ffffff",
          // 100: "#1e4187",
          // 200: "#1f3561",
          300: "#f0f0f0",
          400: "#1F2A40", // menu color
          500: "#141b2d", // background 
        },
        blueAccent: "#4985e2",
        blueAccentReverse: "#461eb7",
      }
    : {
        grey: {
          100: "#3d3d3d",
          500: "#666666",
          700: "#e0e0e0",
        },
        primary: {
          100: "#000000",
          // 100: "#141b2d",
          // 200: "#a1a4ab",
          300: "#6f6f6f",
          400: "#f2f0f0", 
          // 500: "#fcfcfc",
          500: "#ffffff",
        },
        // blueAccent: "#4985e2",
        blueAccent: "#461eb7",
        blueAccentReverse: "#4985e2",
        

      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[300],
            },
            secondary: {
              main: colors.blueAccent,
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[300],
            },
            secondary: {
              main: colors.blueAccent,
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }),
    },
    typography: {
      fontFamily: ["Made outer sans", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Made outer sans", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Made outer sans", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Made outer sans", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Made outer sans", "sans-serif"].join(","),
        fontSize: 18,
      },
      h5: {
        fontFamily: ["Made outer sans", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Made outer sans", "sans-serif"].join(","),
        fontSize: 14,
      },
    }
    // button: {
    //   fontSize: 26,
    //   fontWeight: 700,
    // },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // const [mode, setMode] = useState("dark");
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};