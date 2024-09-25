import { useMemo } from "react";
import { ThemeOptions, createTheme } from "@mui/material/styles";
import { useLocalStorage } from "usehooks-ts";
import { useMediaQuery } from "@mui/material";

declare module '@mui/material/Badge' {
  interface BadgePropsVariantOverrides {
    oob: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    code: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    code?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    code: true;
  }
}

const lightModeDesignTokens = {
  palette: {
    mode: "light",
    primary: {
      main: "#461eb7",
      hover: "rgba(70, 30, 183, 0.05)",
      active: "rgba(70, 30, 183, 0.15)",
    },
    text: {
      secondary: "rgba(0, 0, 0, 0.4)",
      tertiary: "rgba(0, 0, 0, 0.3)"
    },
    inputBorder: "rgba(0, 0, 0, 0.23)",
    destructive: {
      main: "#d32f2f",
      contrastText: "#fff"
    }
  },
};

const darkModeDesignTokens = {
  palette: {
    mode: "dark",
    primary: {
      main: "#4985e2",
      hover: "rgba(73, 133, 226, 0.05)",
      active: "rgba(73, 133, 226, 0.15)",
    },
    text: {
      secondary: "rgba(255, 255, 255, 0.4)",
      tertiary: "rgba(255, 255, 255, 0.3)"
    },
    inputBorder: "rgba(255, 255, 255, 0.23)",
    destructive: {
      main: "#d32f2f",
      contrastText: "#fff"
    }
  },
};

function createThemeSettings(mode: ThemeMode): ThemeOptions {
  const palette =
    mode === "light" ? lightModeDesignTokens : darkModeDesignTokens;

  return {
    ...palette,
    components: {
      MuiStack: {
        defaultProps: {
          useFlexGap: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },
      MuiInputBase: {
        defaultProps: {
          autoComplete: "one-time-code",
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            padding: "4px",
            marginLeft: "5px",
            marginRight: "5px",
          },
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            "&>.MuiFormControl-root": {
              height: "100%",
            },
          },
          inputRoot: ({ theme, ownerState }) => {
            if (ownerState?.size !== "small") return;

            return {
              height: "100%",
              paddingTop: theme.spacing(0.5) + " !important",
              paddingBottom: theme.spacing(0.5) + " !important",
            };
          },
        },
      },
      MuiBadge: {
        variants: [
          {
            props: { variant: "oob" },
            style: {
              "& .MuiBadge-badge": {
                right: "-10%",
              },
            },
          },
        ],
        styleOverrides: {
          badge: ({ theme }) => ({
            height: 16,
            minWidth: 16,
            letterSpacing: 0,
            paddingLeft: theme.spacing(0.5),
            paddingRight: theme.spacing(0.5),
          }),
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            "@keyframes fade-in": {
              "0%": {
                opacity: 0,
              },
              "100%": {
                opacity: 1,
              },
            },
            "@keyframes pulse": {
              "0%": {
                opacity: 1,
              },
              "50%": {
                opacity: 0.4,
              },
              "100%": {
                opacity: 1,
              },
            },
            animation:
              "fade-in 1s ease-in 0.5s, pulse 2s ease-in-out 1.5s infinite",
            opacity: 0,
          },
        },
      },
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
        textTransform: "none",
      },
      code: {
        fontFamily: '"Source Code Pro"',
      },
    },
    // @ts-ignore
    bgColorFromString: (str: string) => {
      const hash = getHashCode(str);
      const hue = Math.abs(hash % 90) * 4;
      const lightness = mode === "light" ? 30 : 90;
      return {
        bgcolor: `hsl(${hue}, 90%, ${lightness - 10}%)`,
        "@supports (color:oklch(0% 0 0))": {
          bgcolor: `oklch(${lightness}%, 0.25, ${hue})`,
        },
      };
    },
  };
}

type ThemeMode = "dark" | "light";

export const useCreateTheme = () => {
  const { isDarkMode } = useDarkMode();
  const mode: ThemeMode = isDarkMode ? "dark" : "light";
  const theme = useMemo(() => createTheme({ ...createThemeSettings(mode), cssVariables: true }), [mode]);
  return theme;
};

export function useDarkMode() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useLocalStorage("ason-dark-mode", "system");

  let isDarkMode = darkMode === "dark";
  if (darkMode === "system") {
    isDarkMode = prefersDarkMode;
  }

  return {
    isDarkMode,
    darkMode,
    setDarkMode,
  };
}

function getHashCode(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) {
    hash = s.charCodeAt(i) * 14 + ((hash << 5) - hash);
  }
  return hash;
}


