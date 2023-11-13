import { useEffect,  } from 'react';
import { Stack } from "@mui/material";
import { useFetcher } from 'react-router-dom';

export function ComplianceDocumentsView() {
  const fetcher = useFetcher({key: "compliance-documents"});

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data)
      fetcher.load("documents");
  }, [fetcher]);

  return (
    <Stack direction="row" spacing={2}>
      {
        fetcher.data && fetcher.data.map(doc => <ComplianceDocumentCard document={doc} />)
      }
    </Stack>
  )
}

function ComplianceDocumentCard({ document }) {
  
}

function UploadCard() {
  
}