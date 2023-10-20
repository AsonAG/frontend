import { Chip, Typography } from "@mui/material"
import { useStringColor } from "../../theme"

export function CategoryLabel({ label, sx }) {
  const color = useStringColor(label);
  const labelComponent = <Typography color="background.default" fontSize={12}>{label}</Typography>;
  return <Chip label={labelComponent} variant="outlined" size="small" sx={{bgcolor: color, border: 0, ...sx}}/>
  
}
