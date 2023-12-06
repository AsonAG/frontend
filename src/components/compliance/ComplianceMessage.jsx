import { useTranslation } from "react-i18next";
import { Typography, Stack, Paper } from "@mui/material";
import { useState } from "react";
import { formatDate } from "../../utils/DateUtils";
import { DocumentLink } from "../DocumentLink";
import { DocumentDialog } from "../DocumentDialog";

export function ComplianceMessage({ message }) {
    const { t } = useTranslation();
    const [document, setDocument] = useState(null);
    const toXmlDoc = name => ({ name, content: message[name], contentType: "text/xml" });
    return (
        <Stack component={Paper} spacing={1} p={2}>
            <Typography fontWeight="bold" noWrap flex={1}>{message.messageType}</Typography>
            <Typography>{formatDate(message.created, true)}</Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap">
                <MessageLink name={t("Request")} content={message.request} setDocument={setDocument} />
                <MessageLink name={t("Response")} content={message.response} setDocument={setDocument}  />
                <MessageLink name={t("Encrypted request")} content={message.encryptedRequest} setDocument={setDocument}  />
                <MessageLink name={t("Encrypted response")} content={message.encryptedResponse} setDocument={setDocument}  />
            </Stack>
            {document && <DocumentDialog documentPromise={Promise.resolve(document)} onClose={() => setDocument(null)} />}
        </Stack>
    );
}

function MessageLink({name, content, setDocument}) {
    const handleClick = () => {
        setDocument({
            name,
            content,
            contentType: "text/xml"
        });
    }
    return <DocumentLink name={name} onClick={handleClick} />
}