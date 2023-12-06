import { ContentLayout, ContentStack } from "../ContentLayout";
import { useTranslation } from "react-i18next";
import { useLocation, Await, useLoaderData, useAsyncValue } from "react-router-dom";
import { Skeleton, Typography, Stack } from "@mui/material";
import { Suspense } from "react";
import { ComplianceMessage } from "./ComplianceMessage";


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
        <Suspense fallback={<LoadingComplianceMessages />}>
          <Await resolve={loaderData.messages}>
            <ComplianceMessages />
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

function ComplianceMessages() {
  const messages = useAsyncValue();
  return messages.map(msg => <ComplianceMessage key={msg.id} message={msg} />);
}

function LoadingComplianceMessages() {
  return <>
    <Skeleton variant="rectangular" height="110px" />
    <Skeleton variant="rectangular" height="110px" />
    <Skeleton variant="rectangular" height="110px" />
  </>
}