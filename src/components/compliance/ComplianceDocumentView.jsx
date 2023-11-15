import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { Button, IconButton, Stack, Menu, MenuItem, ListItemIcon, Link } from "@mui/material";
import { useAsyncValue, useLocation } from 'react-router-dom';
import { XmlView } from "./XmlView";
import { useMemo, useState } from "react";
import { base64Decode } from "../../services/converters/BinaryConverter";
import { DeleteForever, Download, MoreVert } from "@mui/icons-material";
import { getDataUrl } from "../../utils/DocumentUtils";


export function AsyncComplianceDocumentView() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const title = state?.document ? state.document.name : t("Loading...");
  const loading = <ContentLayout title={title} />
  return (
    <AsyncDataRoute loadingElement={loading} skipDataCheck>
      <ComplianceDocumentView />
    </AsyncDataRoute>
  );
}

const destructiveMenuItem = {
  color: theme => theme.palette.error.main
};

function ComplianceDocumentView() {
  const { t } = useTranslation();
  const doc = useAsyncValue();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const docXml = useMemo(() => base64Decode(doc.content), [doc.content]);

  const buttons = <IconButton onClick={handleClick}>
    <MoreVert />
  </IconButton>;
  
  return (
    <ContentLayout title={doc.name} height="100%" buttons={buttons}>
      <Stack spacing={3} minHeight={0}>
        <XmlView title={t("Content")} xml={docXml} />
        <Stack direction="row" spacing={2} alignSelf="end">
          <Button color="primary">{t("Submit as test")}</Button>
          <Button color="primary" variant="contained">{t("Submit")}</Button>
        </Stack>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Link href={getDataUrl(doc)} download={doc.name} underline="none" color="inherit">
            <MenuItem onClick={handleClose}>
              <ListItemIcon><Download fontSize="small"/></ListItemIcon>
              Download
            </MenuItem>
          </Link>
          <MenuItem onClick={handleClose} sx={destructiveMenuItem}>
            <ListItemIcon sx={destructiveMenuItem}><DeleteForever fontSize="small"/></ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      </Stack>
    </ContentLayout>
  )
}