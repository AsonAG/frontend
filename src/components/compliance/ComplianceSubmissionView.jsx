import { ContentLayout, ContentStack } from "../ContentLayout";
import { useTranslation } from "react-i18next";
import { useLocation, Await, useLoaderData } from "react-router-dom";
import { Skeleton, Typography, Stack } from "@mui/material";
import { Suspense } from "react";

export function AsyncComplianceSubmissionView() {
  const { state } = useLocation();
  const loaderData = useLoaderData();
  const detailLoading = ComplianceSubmissionDetails(state?.submission);
  // const messagesLoading = 
  return (
    <Stack>
      <Suspense fallback={detailLoading}>
        <Await resolve={loaderData.submission}>
          {ComplianceSubmissionDetails}
        </Await>
      </Suspense>
      <Suspense>
        <Await resolve={loaderData.messages}>
          {ComplianceSubmissionMessages}
        </Await>
      </Suspense>
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


function ComplianceSubmissionMessages(messages) {
  const { t } = useTranslation();
  return (
    <ContentStack>
      <Typography variant="h6">{t("Messages")}</Typography>
      {
        messages.map(msg => <Typography key={msg.id}>{msg.messageKind}</Typography>)
      }
    </ContentStack>
  );
}