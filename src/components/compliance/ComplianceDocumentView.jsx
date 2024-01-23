import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { Button, IconButton, ButtonGroup, Stack, Menu, MenuItem, ListItemIcon, Link, Popper, Paper, ClickAwayListener, Grow, MenuList, Typography } from "@mui/material";
import { useAsyncValue, useLoaderData, useLocation, useSubmit } from 'react-router-dom';
import { XmlView } from "./XmlView";
import { useMemo, useState, useRef } from "react";
import { base64Decode } from "../../services/converters/BinaryConverter";
import { DeleteForever, Download, MoreVert, ArrowDropDown, PictureAsPdf } from "@mui/icons-material";
import { getDataUrl } from "../../utils/DocumentUtils";
import { DocumentDialog } from "../DocumentDialog";


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
  const { pdfPromise } = useLoaderData();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowPdf = () => {
    handleClose();
    setShowPdf(true);
  }
 
  const docXml = useMemo(() => base64Decode(doc.content), [doc.content]);

  const buttons = <IconButton onClick={handleClick}>
    <MoreVert />
  </IconButton>;
  
  return (
    <ContentLayout title={doc.name} height="100%" buttons={buttons}>
      <Stack spacing={3} minHeight={0}>
        <XmlView title={t("Content")} xml={docXml} />
        <Typography sx={{alignSelf: "end"}}>TODO: Substitution</Typography>
        <SubmitButton />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Link href={getDataUrl(doc)} download={doc.name} underline="none" color="inherit">
            <MenuItem onClick={handleClose}>
              <ListItemIcon><Download fontSize="small"/></ListItemIcon>
              {t("Download")}
            </MenuItem>
          </Link>
          <MenuItem onClick={handleShowPdf}>
            <ListItemIcon><PictureAsPdf fontSize="small"/></ListItemIcon>
            {t("Display PDF")}
          </MenuItem>
          <MenuItem onClick={handleClose} sx={destructiveMenuItem}>
            <ListItemIcon sx={destructiveMenuItem}><DeleteForever fontSize="small"/></ListItemIcon>
            {t("Delete")}
          </MenuItem>
        </Menu>
        { showPdf && <DocumentDialog documentPromise={pdfPromise} onClose={() => setShowPdf(false)} />}
      </Stack>
    </ContentLayout>
  )
}


function SubmitButton() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [isTestCase, setIsTestCase] = useState(false);
  const { t } = useTranslation();
  const submit = useSubmit();

  const handleClick = () => {
    submit({isTestCase}, { method: "post", encType: "application/json" });
  };

  const handleMenuItemClick = (isTestCase) => {
    setIsTestCase(isTestCase);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  const submitLabel = t("Submit");
  const testCaseSubmitLabel = t("Submit as test case");
  return (
    <>
      <ButtonGroup variant="contained" color="primary" ref={anchorRef} sx={{alignSelf: "end"}}>
        <Button onClick={handleClick}>{isTestCase ? testCaseSubmitLabel : submitLabel}</Button>
        <Button size="small" onClick={handleToggle}>
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem selected={!isTestCase} onClick={() => handleMenuItemClick(false)}>{submitLabel}</MenuItem>
                  <MenuItem selected={isTestCase} onClick={() => handleMenuItemClick(true)}>{testCaseSubmitLabel}</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}