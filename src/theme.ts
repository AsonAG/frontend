import { useMemo } from "react";
import { ThemeOptions, createTheme } from "@mui/material/styles";
import { useLocalStorage } from "usehooks-ts";
import { alpha, darken, lighten, useMediaQuery } from "@mui/material";
import { lightColors, darkColors } from './colors'

declare module '@mui/material/styles' {
  interface Palette {
    selection: Palette['primary'];
    selectionAttention: Palette['primary'];
  }

  interface PaletteOptions {
    selection?: PaletteOptions['primary'];
    selectionAttention: Palette['primary'];
  }
}

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

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    destructive: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    blueviolet: true
    pdfred: true
    green: true
  }
}

const lightModeDesignTokens = {
  palette: {
    mode: "light",
    primary: {
      main: lightColors.primary,
      hover: alpha(lightColors.primary, 0.05),
      active: alpha(lightColors.primary, 0.15),
    },
    selection: {
      main: lightColors.selection,
      light: lighten(lightColors.selection, 0.3),
      dark: darken(lightColors.selection, 0.05),
    },
    selectionAttention: {
      main: lightColors.selectionAttention,
      light: lighten(lightColors.selectionAttention, 0.3),
      dark: darken(lightColors.selectionAttention, 0.01),
    },
    text: {
      secondary: "rgba(0, 0, 0, 0.4)",
      tertiary: "rgba(0, 0, 0, 0.3)"
    },
    inputBorder: "rgba(0, 0, 0, 0.23)",
    destructive: {
      main: "#d32f2f",
      contrastText: "#fff"
    },
    blueviolet: {
      main: "#8A2BE2",
      contrastText: "#fff"
    },
    pdfred: {
      main: "#FF0000",
      contrastText: "#fff"
    },
    green: {
      main: "rgb(33, 115, 70)",
      contrastText: "#fff"
    }
  },
};

const darkModeDesignTokens = {
  palette: {
    mode: "dark",
    primary: {
      main: darkColors.primary,
      hover: alpha(darkColors.primary, 0.075),
      active: alpha(darkColors.primary, 0.15),
    },
    selection: {
      main: darkColors.selection,
      light: lighten(darkColors.selection, 0.05),
      dark: darken(darkColors.selection, 0.15),
    },
    selectionAttention: {
      main: darkColors.selectionAttention,
      light: lighten(darkColors.selectionAttention, 0.05),
      dark: darken(darkColors.selectionAttention, 0.25),
    },
    text: {
      secondary: "rgba(255, 255, 255, 0.4)",
      tertiary: "rgba(255, 255, 255, 0.3)"
    },
    inputBorder: "rgba(255, 255, 255, 0.23)",
    destructive: {
      main: "#d32f2f",
      contrastText: "#fff"
    },
    blueviolet: {
      main: "#8A2BE2",
      contrastText: "#fff"
    },
    pdfred: {
      main: "#FF0000",
      contrastText: "#fff"
    },
    green: {
      main: "rgb(33, 115, 70)",
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
      MuiTooltip: {
        defaultProps: {
          "disableInteractive": true
        }
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
            if (ownerState?.size === "small" && ownerState?.variant !== "filled") {
              return {
                height: "100%",
                paddingTop: theme.spacing(0.5) + " !important",
                paddingBottom: theme.spacing(0.5) + " !important",
              };
            }
          },
        },
      },
      MuiBadge: {
        variants: [
          {
            props: { variant: "oob" },
            style: {
              "& .MuiBadge-badge": {
                right: "-5%",
              },
            },
          },
        ],
        styleOverrides: {
          badge: ({ theme, ownerState }) => {
            if (ownerState?.variant !== "dot") {
              return {
                height: 16,
                minWidth: 16,
                letterSpacing: 0,
                paddingLeft: theme.spacing(0.5),
                paddingRight: theme.spacing(0.5),
              };
            }
          },
        }
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
