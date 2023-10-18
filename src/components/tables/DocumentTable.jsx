import {
  Divider,
  Stack,
  Typography,
  IconButton,
  Button,
  Paper,
  Collapse,
  Link,
  CircularProgress
} from "@mui/material";
import { React, useState } from "react";
import { useAsyncValue, Outlet, Link as RouterLink } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { useTranslation } from "react-i18next";
import { Attachment, ExpandLess, ExpandMore } from "@mui/icons-material";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import dayjs from "dayjs";
import { ContentLayout } from "../ContentLayout";


export function AsyncDocumentTable() {
  return (
    <ContentLayout title="Documents">
      <AsyncDataRoute>
        <DocumentTable />
      </AsyncDataRoute>
    </ContentLayout>
  );
}


function DocumentTable() {
  const caseFields = useAsyncValue();

  return (
    <>
      <Stack spacing={3} pb={3}>
        {caseFields.map(caseField => <DocumentCard key={caseField.id} caseFieldName={caseField.name} />)}
      </Stack>
      <Outlet />
    </>
  );
};

const documentLinkSx = {
  textDecoration: 'none',
  color: (theme) => theme.palette.primary.main,
}
function CaseValueRow({ caseValue }) {
  return (
    <Stack pl={0.5}>
      {
        caseValue.documents.map(document => 
          <Link component={RouterLink} key={document.id} to={`${caseValue.id}/i/${document.id}`} sx={documentLinkSx}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Attachment fontSize="small"/>
              <Typography>{document.name}</Typography>
            </Stack>
          </Link>
        )
      }
    </Stack>
  )
}

function LoadDocumentsButton({loading, hasMore, onClick, allLoadedText, sx}) {
  const { t } = useTranslation();
  const text = loading ? "Loading..." :
    hasMore ? "Load more" : allLoadedText;

  return (
    <Button 
      disabled={loading || !hasMore}
      startIcon={loading && <CircularProgress size="1rem" sx={{color: (theme) => theme.palette.text.disabled}} />}
      onClick={onClick}
      sx={sx}
    >
      {t(text)}
    </Button>
  );
}

function DocumentCard({caseFieldName}) {
  const [open, setOpen] = useState(true);
  const { documents, loading, hasMore, loadMore } = useDocuments(caseFieldName);
  const { t } = useTranslation();
  const onClick = () => setOpen(o => !o);
  const groupedDocuments = Object.groupBy(documents.items, 
    ({start}) => {
      const date = dayjs.utc(start);
      return date.isValid() ? date.format("MMMM YYYY") : t("Without date");
    });
  const entries = Object.entries(groupedDocuments);
  const allLoadedText = documents.items.length === 0 ? "No documents available" : "Showing all documents";

  return (
    <Paper>
      <Stack>
        <Stack direction="row" alignItems="center" sx={{pl: 2, pr: 1, py: 1}} spacing={2}>
          <Typography variant="h6" flex={1}>{caseFieldName}</Typography>
          <IconButton onClick={onClick}>
            { open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Stack>
        <Collapse in={open} mountOnEnter>
          <Divider />
          {
            entries.length > 0 && (
              <Stack sx={{px: 2, pt: 2}} spacing={1} alignItems="start">
                {entries.map(([key, values]) => <DocumentMonthGroup key={key} month={key} items={values} />)}
              </Stack>
            )
          }
          <LoadDocumentsButton loading={loading} hasMore={hasMore} onClick={loadMore} allLoadedText={allLoadedText} sx={{m: 1}} />
        </Collapse>
      </Stack>
    </Paper>
  )
}

function DocumentMonthGroup({month, items}) {
  return (
    <Stack>
      <Typography variant="subtitle">{month}</Typography>
      {items.map(caseValue => <CaseValueRow key={caseValue.id} caseValue={caseValue} />)}
    </Stack>
  )
}