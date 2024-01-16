import { useTranslation } from "react-i18next";
import { Typography, Stack, Paper, Tooltip } from "@mui/material";
import { useState } from "react";
import { formatDate } from "../../utils/DateUtils";
import { DocumentLink } from "../DocumentLink";
import { DocumentDialog } from "../DocumentDialog";
import { Error } from "@mui/icons-material";

export function ComplianceMessage({ message }) {
    const { t } = useTranslation();
    const [documentPromise, setDocumentPromise] = useState(null);
    return (
        <Stack component={Paper} spacing={1} p={2}>
            <Stack direction="row" spacing={1} flex={1}>
                <Typography fontWeight="bold" noWrap>{message.messageType}</Typography>
                <MessageError message={message} />
            </Stack>
            <Typography>{formatDate(message.created, true)}</Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap">
                <MessageLink name={t("Request")} content={message.request} setDocumentPromise={setDocumentPromise} />
                <MessageLink name={t("Response")} content={message.response} setDocumentPromise={setDocumentPromise}  />
                { message.encryptedRequest && <MessageLink name={t("Encrypted request")} content={message.encryptedRequest} setDocumentPromise={setDocumentPromise}  /> }
                { message.encryptedResponse && <MessageLink name={t("Encrypted response")} content={message.encryptedResponse} setDocumentPromise={setDocumentPromise}  /> }
            </Stack>
            {documentPromise && <DocumentDialog documentPromise={documentPromise} onClose={() => setDocumentPromise(null)} />}
        </Stack>
    );
}

function MessageLink({name, content, setDocumentPromise}) {
    const handleClick = () => {
        setDocumentPromise(Promise.resolve({
            name,
            content,
            contentType: "text/xml"
        }));
    }
    return <DocumentLink name={name} onClick={handleClick} />
}

function MessageError({message}) {
    if (!message.errors)
        return null

    return <Tooltip title={message.errors}>
        <Error color="error" />
    </Tooltip>
}