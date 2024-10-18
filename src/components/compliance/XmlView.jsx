import { Typography } from "@mui/material";
import { useMemo } from "react";
import { base64Decode } from "../../services/converters/BinaryConverter";

const codeTypographySx = {
	whiteSpace: "pre-wrap",
	wordBreak: "break-word",
	overflow: "auto",
};

export function XmlView({ title, base64content, codeProps }) {
	const xml = useMemo(() => base64Decode(base64content), [base64content]);
	const prettyXml = useMemo(() => prettifyXml(xml), [xml]);
	return (
		<>
			{title && <Typography variant="h6">{title}</Typography>}
			<Typography variant="code" sx={{ ...codeProps, ...codeTypographySx }}>
				{prettyXml}
			</Typography>
		</>
	);
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

function prettifyXml(sourceXml) {
	if (!sourceXml) {
		return "";
	}
	var xmlDoc = new DOMParser().parseFromString(sourceXml, "application/xml");
	var xsltDoc = new DOMParser().parseFromString(
		xlstTemplate,
		"application/xml",
	);

	var xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet(xsltDoc);
	var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
	var resultXml = new XMLSerializer().serializeToString(resultDoc);
	return resultXml;
}
