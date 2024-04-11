import { Suspense, useState } from "react";
import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Stack,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useDarkMode } from "../../theme";
import { Close, ImportExport } from "@mui/icons-material";
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent, ResponsiveDialogTrigger } from "../../components/ResponsiveDialog";
import { useTranslation } from "react-i18next";
import { DatePicker } from "../../components/DatePicker";
import { useAtomValue } from "jotai";
import { tenantAtom, userAtom } from "../../utils/dataAtoms";
import dayjs from "dayjs";
import { requestExportDataDownload } from "../../api/FetchClient";

function Topbar({ children }) {
  const { isDarkMode, setDarkMode } = useDarkMode();
  

  return (
    <AppBar elevation={0} sx={{ backgroundColor: "background.default", borderBottom: 1, borderColor: "divider" }}>
      <Toolbar disableGutters sx={{mx: {sm: 2}, gap: {xs: 1, sm: 2}}} spacing={1} >
        {children}
        <Box sx={{flexGrow: 1}} />

        <Stack direction="row" spacing={0.5}>
          <Suspense>
            <ExportButton />
          </Suspense>
          <IconButton onClick={() => setDarkMode(isDarkMode ? 'light' : 'dark')} size="large">
            {isDarkMode ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

function ExportButton() {
  const user = useAtomValue(userAtom);
  const { t } = useTranslation();
  if (user?.identifier !== "edu@ason.ch") {
    return;
  }

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger>
        <IconButton onClick={() => {}} size="large">
          <ImportExport />
        </IconButton>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <Stack direction="row" spacing={1}>
          <Typography variant="h6" flex={1}>{t("Export data")}</Typography>
          <ResponsiveDialogClose>
            <IconButton>
              <Close />
            </IconButton>
          </ResponsiveDialogClose>
        </Stack>
        <ExportDialog />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

function ExportDialog() {
  const tenant = useAtomValue(tenantAtom);
  const [selectedOption, setSelectedOption] = useState("tenantCreationDate");
  const [exportDate, setExportDate] = useState(dayjs(tenant.created));
  const downloadExport = async () => {
    let name = `${tenant.identifier}_export`;
    let cutoffDate = null;
    if (selectedOption !== "all") {
      cutoffDate = exportDate.toISOString();
      name = `${name}_${cutoffDate}`;
    }
    name = name + ".json";
    
    await requestExportDataDownload({tenantId: tenant.id}, cutoffDate, name);
  };
  return (
    <Stack spacing={1}>
      <Typography>Der Export beinhaltet alle Mitarbeiter und Company/Employee Case Changes.<br/>Für die Case Changes kann der Zeitpunkt noch gewählt werden:</Typography>
      <FormControl>
        <RadioGroup
          value={selectedOption}
          onChange={(event) => setSelectedOption(event.target.value)}
        >
          <FormControlLabel value="all" control={<Radio />} label="Alle" />
          <FormControlLabel value="tenantCreationDate" control={<Radio />} label="Alle Case Changes nach dem Erstellungsdatum des Tenants" />
          <FormControlLabel value="customDate" control={<Radio />} label="Alle Case Changes ab Zeitpunkt" />
        </RadioGroup>
      </FormControl>
      {
        selectedOption === "customDate" && 
          <DatePicker value={exportDate} onChange={setExportDate} variant="datetime" slotProps={{popper: {sx: {"pointerEvents": "all"}}}}/>
      }
      <Button variant="contained" color="primary" onClick={downloadExport}>Export</Button>
    </Stack>
  )
  
}

export default Topbar;
