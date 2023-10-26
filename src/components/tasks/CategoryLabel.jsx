import { Chip, Typography, useTheme } from "@mui/material"

export function CategoryLabel({ label, sx }) {
  if (!label) return;
  const theme = useTheme();
  const labelComponent = <Typography color="background.default" fontSize={12}>{label}</Typography>;
  return <Chip label={labelComponent} variant="outlined" size="small" sx={{border: 0, px: 0.5, ...sx, ...theme.bgColorFromString(label)}}/>
  
}
