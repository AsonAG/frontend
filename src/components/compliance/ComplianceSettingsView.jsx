import { useReducer, useState, Suspense } from 'react';
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { Alert, Box, Button, Divider, ListSubheader, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { checkInteroperabilityCompliance, pingCompliance } from "../../api/FetchClient";
import { useLoaderData, useParams, useSubmit, Await, useAsyncValue } from 'react-router-dom';
import { EnterpriseCertificatePicker, TransmitterCertificatePicker } from './ComplianceCertificatePicker';
import { Loading } from '../Loading';
import { ErrorView } from '../ErrorView';
import { useUpdateEffect } from 'usehooks-ts';
import { ComplianceMessage } from './ComplianceMessage';


export function AsyncComplianceSettingsView() {
  const { t } = useTranslation();
  const routeData = useLoaderData();
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  }
  
  return (
    <ContentLayout title={t("Settings")} height="100%">
      <Stack direction="row" flex={1}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          sx={{minWidth: 140}}
        >
          <Tab label={t("Transmitter")} sx={{alignItems: "start", pl: 0}} disableRipple/>
          <Tab label={t("Ping")} sx={{alignItems: "start", pl: 0}} disableRipple/>
          <Tab label={t("CheckInteroperability")} sx={{alignItems: "start", pl: 0}} disableRipple/>
        </Tabs>
        <Divider flexItem orientation="vertical" />
        <TabPanel value={value} index={0}>
          <Suspense fallback={<Loading />}>
            <Await resolve={routeData.data} errorElement={<ErrorView />}>
              <ComplianceSettingsView />
            </Await>
          </Suspense>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Ping />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CheckInteroperability />
        </TabPanel>
      </Stack>
    </ContentLayout>
  );
}

function reducer(state, action) {
  if (action.type === "set_submission_url") {
    return {
      ...state,
      submissionUrl: action.value
    };
  }
  if (action.type === "set_monitoring_id") {
    return {
      ...state,
      monitoringId: action.value
    };
  }
  if (action.type === "set_transmitter_certificate") {
    return {
      ...state,
      transmitterCertificate: action.value
    };
  }
  if (action.type === "set_enterprise_certificate") { 
    return {
      ...state,
      uidCertificate: action.value
    };
  }
  if (action.type === "set_settings") {
    return action.settings;
  }

  throw new Error("invalid action");
}

const defaultProductionUrl = "https://distributor.swissdec.ch/services/elm/SalaryDeclaration/20200220";

const productionUrls = [
  defaultProductionUrl
]

const testingUrls = [
  "https://tst.itserve.ch/swissdec/refapps/stable/receiver/services/SalaryDeclarationService20200220",
  "https://tst.itserve.ch/swissdec/refapps/next/receiver/services/SalaryDeclarationService20200220",
  "https://tst.itserve.ch/swissdec/qualitytool/stable/services/SalaryDeclarationService20200220",
  "https://tst.itserve.ch/swissdec/qualitytool/next/services/SalaryDeclarationService20200220"
]

function ComplianceSettingsView() {
  const { t } = useTranslation();
  const loadedSettings = useAsyncValue();
  const [settings, dispatch] = useReducer(reducer, loadedSettings);
  const submit = useSubmit();

  useUpdateEffect(() => dispatch({settings: loadedSettings, type: "set_settings"}), [loadedSettings]);

  const onSave = () => submit(settings, { method: "post", encType: "application/json" });

  return (
    <Stack spacing={2} flex={1}>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography width={170}>{t("Submission url")}</Typography>
        <Select value={settings.submissionUrl} sx={{flex: 1}} onChange={e => dispatch({value: e.target.value, type: "set_submission_url"})}  displayEmpty>
          <ListSubheader>{t("Production")}</ListSubheader>
          {
            productionUrls.map(url => <MenuItem key={url} value={url === defaultProductionUrl ? null : url}>{url}</MenuItem>)
          }
          <ListSubheader>{t("Testing")}</ListSubheader>
          {
            testingUrls.map(url => <MenuItem key={url} value={url}>{url}</MenuItem>)
          }
        </Select>
      </Stack>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography width={170}>{t("MonitoringId")}</Typography>
        <Select value={settings.monitoringId} sx={{flex: 1}} onChange={e => dispatch({value: e.target.value, type: "set_monitoring_id"})}  displayEmpty>
          <MenuItem value={null}>ason</MenuItem>
          <MenuItem value="asoncert">asoncert</MenuItem>
        </Select>
      </Stack>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography width={170}>{t("Transmitter Certificate")}</Typography>
        <TransmitterCertificatePicker value={settings.transmitterCertificate} setValue={value => dispatch({value, type: "set_transmitter_certificate"})} />
      </Stack>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography width={170}>{t("Enterprise Certificate")}</Typography>
        <EnterpriseCertificatePicker value={settings.uidCertificate} setValue={value => dispatch({value, type: "set_enterprise_certificate"})} />
      </Stack>
      <Button variant="contained" sx={{alignSelf: "end"}} onClick={onSave}>{t("Save")}</Button>
    </Stack>
  );
}

function ComplianceResponse({response, successMessage}) {
  if (!response.request) {
    return null
  }

  const message = response.errors ?
    <Alert severity="error" variant="filled"><Typography>{response.errors}</Typography></Alert> :
    <Alert severity="success" variant="filled"><Typography>{successMessage}</Typography></Alert>;
  
  return (
    <Stack spacing={2} flex={1}>
      {message}
      <ComplianceMessage message={response} />
    </Stack>
  )
}

function Ping() {
  const { t } = useTranslation();
  const params = useParams();
  const [response, setResponse] = useState({});
  
  const execute = async () => {
    const response = await pingCompliance(params);
    setResponse(response);
  }

  return (
    <Stack spacing={2} flex={1}>
      <Button variant="contained" onClick={execute} sx={{alignSelf: "start"}}>{t("Ping")}</Button>
      <Divider flexItem />
      <ComplianceResponse response={response} successMessage={t("Ping successful!")}/>
    </Stack>
  );
}


function CheckInteroperability() {
  const { t } = useTranslation();
  const params = useParams();
  const [secondOperand, setSecondOperand] = useState("1.00");
  const [response, setResponse] = useState({});
  
  const execute = async () => {
    const response = await checkInteroperabilityCompliance(params, secondOperand);
    setResponse(response);
  }

  const onBlur = e => {
    let value = parseFloat(e.target.value);
    value = isNaN(value) ? 1 : value;
    setSecondOperand((Math.trunc(value * 100) / 100).toFixed(2));
  }
  
  return (
    <Stack spacing={2} flex={1}>
      <Stack direction="row" alignContent="start" spacing={2}>
        <TextField variant="standard" label={t("Second Operand")} value={secondOperand} onChange={e => setSecondOperand(e.target.value)} onBlur={onBlur}/>
        <Button variant="contained" onClick={execute} sx={{alignSelf: "stretch", alignItems: "center"}}>{t("Check interoperability")}</Button>
      </Stack>
      <Divider flexItem />
      <ComplianceResponse response={response} successMessage={t("CheckInteroperability successful!")}/>
    </Stack>
  );
}

function TabPanel(props) {
  const { value, index, children } = props;

  if (value !== index)
    return null;

  return <Box sx={{px: 4}} flex={1} display="flex">{children}</Box>;
}