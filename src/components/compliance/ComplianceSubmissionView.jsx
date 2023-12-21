import { ContentLayout, ContentStack } from "../ContentLayout";
import { useTranslation } from "react-i18next";
import { useLocation, Await, useLoaderData, useAsyncValue } from "react-router-dom";
import { Skeleton, Typography, Stack } from "@mui/material";
import { Suspense } from "react";
import { ComplianceMessage } from "./ComplianceMessage";


export function AsyncComplianceSubmissionView() {
  const { state } = useLocation();
  const loaderData = useLoaderData();
  const detailLoading = ComplianceSubmissionDetails(state?.submission);
  return (
    <Stack>
      <Suspense fallback={detailLoading}>
        <Await resolve={loaderData.submission}>
          {ComplianceSubmissionDetails}
        </Await>
      </Suspense>
      
      <ContentStack>
        <ComplianceMessagesView messagesPromise={loaderData.messages} />
      </ContentStack>
    </Stack>
  );
}

function ComplianceSubmissionDetails(submission) {
  const { t } = useTranslation();
  return (
    <ContentLayout title={submission ? submission.name : <Skeleton />}>
      <Typography variant="h6">{t("Status")}</Typography>
      <Typography>{submission ? t(submission.submissionStatus) : <Skeleton />}</Typography>
      <Typography variant="h6">{t("DeclarationId")}</Typography>
      <Typography>{submission ? submission.declarationId ?? "No declaration id" : <Skeleton />}</Typography>
    </ContentLayout>
  )
}

function ComplianceMessages() {
  const messages = useAsyncValue();
  return messages.map(msg => <ComplianceMessage key={msg.id} message={msg} />);
}

export function ComplianceMessagesView({messagesPromise}) {
  const { t } = useTranslation();
  return <>
    <Typography variant="h6">{t("Messages")}</Typography>
    <Suspense fallback={<LoadingComplianceMessages />}>
      <Await resolve={messagesPromise}>
        <ComplianceMessages />
      </Await>
    </Suspense>
  </>
}

function LoadingComplianceMessages() {
  return <>
    <Skeleton variant="rectangular" height="110px" />
    <Skeleton variant="rectangular" height="110px" />
    <Skeleton variant="rectangular" height="110px" />
  </>
}