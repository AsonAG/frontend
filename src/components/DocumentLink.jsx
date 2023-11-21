import { Stack, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Attachment } from "@mui/icons-material";

export function DocumentLink({name, ...linkProps }) {
  return (
    <Link component={RouterLink} underline="none" state={{name}} {...linkProps}>
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <Attachment fontSize="small"/>
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
}
