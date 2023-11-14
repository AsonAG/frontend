import { Typography } from "@mui/material";
import { useMemo } from "react";

export function XmlView({ title, xml }) {
  const prettyXml = useMemo(() => prettifyXml(xml), [xml]);
  return <>
    <Typography variant="h6">{title}</Typography>
    <Typography whiteSpace="pre-wrap" overflow="auto" variant="code">{prettyXml}</Typography>
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