import { useState } from 'react';
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { Alert, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { checkInteroperabilityCompliance, pingCompliance } from "../../api/FetchClient";
import { useParams } from 'react-router-dom';


export function AsyncComplianceSettingsView() {
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("Compliance")} height="100%">
      <AsyncDataRoute skipDataCheck>
        <ComplianceSettingsView />
      </AsyncDataRoute>
    </ContentLayout>
  );
}

function ComplianceSettingsView() {
  const params = useParams();
  const [response, setResponse] = useState({});
  const [secondOperand, setSecondOperand] = useState(0.0);

  const ping = async () => {
    const response = await pingCompliance(params);
    response.request = prettifyXml(response.request);
    response.response = prettifyXml(response.response);
    setResponse(response);
  }

  const check = async () => {
    const response = await checkInteroperabilityCompliance(params, secondOperand);
    response.request = prettifyXml(response.request);
    response.response = prettifyXml(response.response);
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

function XmlView({title, xml}) {
  return <>
      <Typography variant="h6">{title}</Typography>
      <Typography whiteSpace="pre-wrap" overflow="auto">{xml}</Typography>
  </>;
}


const xlstTemplate = `
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output omit-xml-declaration="yes" indent="yes"/>

  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>`;

function prettifyXml(sourceXml)
{
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString(xlstTemplate, 'application/xml');

    var xsltProcessor = new XSLTProcessor();    
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
};