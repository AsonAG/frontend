import { Alert, Stack, Typography } from "@mui/material";

export function CaseErrorComponent({ errors }) {
    if (!errors.length) return null;

    return <Stack spacing={0.5}>
        {
            errors.flatMap(e => {
                const messages = e.split("\r\n")
                return messages.map(m => <Alert key={e} severity="error" variant="filled"><Typography>{m}</Typography></Alert>)
            })
        }
    </Stack>
}