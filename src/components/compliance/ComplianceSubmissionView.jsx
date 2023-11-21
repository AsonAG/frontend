import { ContentLayout, ContentStack } from "../ContentLayout";
import { useTranslation } from "react-i18next";
import { useLocation, Await, useLoaderData, useAsyncValue } from "react-router-dom";
import { Skeleton, Typography, Stack, Paper } from "@mui/material";
import { Suspense, useState } from "react";
import { formatDate } from "../../utils/DateUtils";
import { DocumentLink } from "../DocumentLink";
import { DocumentDialog } from "../DocumentDialog";


export function AsyncComplianceSubmissionView() {
  const { state } = useLocation();
  const loaderData = useLoaderData();
  const { t } = useTranslation();
  const detailLoading = ComplianceSubmissionDetails(state?.submission);
  return (
    <Stack>
      <Suspense fallback={detailLoading}>
        <Await resolve={loaderData.submission}>
          {ComplianceSubmissionDetails}
        </Await>
      </Suspense>
      
      <ContentStack>
        <Typography variant="h6">{t("Messages")}</Typography>
        <LoadingComplianceSubmissionMessages />
        <Suspense fallback={<LoadingComplianceSubmissionMessages />}>
          <Await resolve={loaderData.messages}>
            <ComplianceSubmissionMessages />
          </Await>
        </Suspense>
      </ContentStack>
    </Stack>
  );
}

function ComplianceSubmissionDetails(submission) {
  const { t } = useTranslation();
  return (
    <ContentLayout title={submission ? submission.name : <Skeleton />}>
      <Typography variant="h6">{t("Status")}</Typography>
      <Typography>{t("In Progress")}</Typography>
      <Typography variant="h6">{t("DeclarationId")}</Typography>
      <Typography>{submission ? submission.declarationId : <Skeleton />}</Typography>
    </ContentLayout>
  )
}

function SubmissionMessage({message}) {
  const { t } = useTranslation();
  const [document, setDocument] = useState(null);
  const toXmlDoc = name => ({name, content: message[name], contentType: "text/xml" });
  return (
    <Stack component={Paper} spacing={1} p={2}>
      <Typography fontWeight="bold" noWrap flex={1}>{message.messageKind}</Typography>
      <Typography>{formatDate(message.created, true)}</Typography>
      <Stack direction="row" spacing={3} flexWrap="wrap">
        <DocumentLink name={t("Signed request")} component="button" onClick={() => setDocument(toXmlDoc("signedRequest"))} />
        <DocumentLink name={t("Signed response")} state={message} onClick={() => setDocument(toXmlDoc("signedResponse"))}/>
        <DocumentLink name={t("Encrypted request")} state={message} onClick={() => setDocument(toXmlDoc("encryptedRequest"))}/>
        <DocumentLink name={t("Encrypted response")} state={message} onClick={() => setDocument(toXmlDoc("encryptedResponse"))}/>
      </Stack>
      { document && <DocumentDialog documentPromise={Promise.resolve(document)} onClose={() => setDocument(null)} /> }
    </Stack>
  );
}


function ComplianceSubmissionMessages() {
  const messages = useAsyncValue();
  return messages.map(msg => <SubmissionMessage key={msg.id} message={msg} />);
}

function LoadingComplianceSubmissionMessages() {
  return <>
    <Skeleton variant="rectangular" height="110px" />
    <Skeleton variant="rectangular" height="110px" />
    <Skeleton variant="rectangular" height="110px" />
  </>
}