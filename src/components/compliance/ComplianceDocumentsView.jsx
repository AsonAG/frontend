import { useEffect, forwardRef } from 'react';
import { Box, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useFetcher } from 'react-router-dom';
import styled from '@emotion/styled';
import { LibraryAdd, TextSnippet } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export function ComplianceDocumentsView() {
  const fetcher = useFetcher({key: "compliance-documents"});

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data)
      fetcher.load("documents");
  }, [fetcher]);

  return (
    <Stack direction="row" spacing={2}>
      {
        fetcher.data && fetcher.data.map(doc => <ComplianceDocumentCard key={doc.id} doc={doc} />)
      }
      <NewCard />
    </Stack>
  )
}

const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme, variant}) => ({
  display: "flex",
  width: variant === "small" ? 100 : 200,
  height: 100,
  textDecoration: "none",
  padding: theme.spacing(1),
  borderWidth: "thin",
  borderColor: theme.palette.primary.main,
  borderStyle: "solid",
  borderRadius: theme.spacing(1.5),
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.hover,
  }
}));

function ComplianceDocumentCard({ doc }) {
  return (
    <Link to={`documents/${doc.id}`}>
      <Stack width="100%">
        <Box flex={1} alignContent="center">
          <TextSnippet fontSize="large"/>
        </Box>
        <Typography whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">{doc.name}</Typography>
      </Stack>
    </Link>
  );
}

function NewCard() {
  const { t } = useTranslation();
  return (
    <Link to="documents/new" variant="small">
      <Stack>
        <Box flex={1} alignContent="center">
          <LibraryAdd fontSize="large"/>
        </Box>
        <Typography>{t("New")}</Typography>
      </Stack>
    </Link>
  );
}
