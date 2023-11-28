import { useReducer, useState } from 'react';
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { Alert, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { checkInteroperabilityCompliance, pingCompliance } from "../../api/FetchClient";
import { useAsyncValue, useParams, useSubmit } from 'react-router-dom';
import { XmlView } from './XmlView';
import { EnterpriseCertificatePicker, TransmitterCertificatePicker } from './ComplianceCertificatePicker';


export function AsyncComplianceSettingsView() {
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("Settings")} height="100%">
      <AsyncDataRoute skipDataCheck>
        <ComplianceSettingsView />
      </AsyncDataRoute>
    </ContentLayout>
  );
}

function reducer(state, action) {
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

  throw new Error("invalid action");
}

// TODO AJO remove this
const fakeCertificates = [
  {
    id: 1,
    name: "MyCompany.pptx12"
  },
  {
    id: 2,
    name: "another cert "
  }
];

function ComplianceSettingsView() {
  const { t } = useTranslation();
  const loadedSettings = useAsyncValue();
  const [settings, dispatch] = useReducer(reducer, loadedSettings);
  const submit = useSubmit();

  const onSave = () => submit(settings, { method: "post", encType: "application/json" });

  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography width={170}>{t("Custom MonitoringId")}</Typography>
        <TextField value={settings.monitoringId} placeholder={t("Default MonitoringId")} onChange={e => dispatch({value: e.target.value, type: "set_monitoring_id"})} sx={{flex:1}} />
      </Stack>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography width={170}>{t("Transmitter Certificate")}</Typography>
        <TransmitterCertificatePicker certificates={fakeCertificates} value={settings.transmitterCertificate} setValue={value => dispatch({value, type: "set_transmitter_certificate"})} />
      </Stack>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography width={170}>{t("Enterprise Certificate")}</Typography>
        <EnterpriseCertificatePicker certificates={fakeCertificates} value={settings.uidCertificate} setValue={value => dispatch({value, type: "set_enterprise_certificate"})} />
      </Stack>
      <Button variant="contained" sx={{alignSelf: "end"}} onClick={onSave}>{t("Save")}</Button>
    </Stack>
  );
}

function ComplianceTestingView() {
  const params = useParams();
  const [response, setResponse] = useState({});
  const [secondOperand, setSecondOperand] = useState(0.0);

  const ping = async () => {
    const response = await pingCompliance(params);
    setResponse(response);
  }

  const check = async () => {
    const response = await checkInteroperabilityCompliance(params, secondOperand);
    setResponse(response);
  }
  
  return (
    <Stack spacing={2} height="90%">
      <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" />}>
        <Button variant="contained" onClick={ping}>Ping</Button>
        <Stack direction="row" spacing={2}>
          <TextField variant="standard" label="Second Operand" value={secondOperand} onChange={e => setSecondOperand(e.target.value)} />
          <Button variant="contained" onClick={check}>CheckInteroperability</Button>
        </Stack>
      </Stack>
      { response.error && <Alert severity="error" variant="filled"><Typography>{response.error}</Typography></Alert>}
      <XmlView title="Request" xml={response.request} />
      <XmlView title="Response" xml={response.response} />
    </Stack>
  )
}

