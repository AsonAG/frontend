import { Alert, Stack, Typography } from "@mui/material";

export function CaseErrorComponent({ errors }) {
    if (!errors.length) return null;

    return <Stack>
        {errors.map(e => <Alert key={e} severity="error" variant="filled"><Typography>{e}</Typography></Alert> )}
    </Stack>
}