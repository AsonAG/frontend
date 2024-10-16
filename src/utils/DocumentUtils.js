export function getDataUrl(document) {
	if (document === null) return null;
	if (document.contentType === "text/xml" || document.contentType === "application/xml") {
		return `data:${document.contentType},${encodeURI(document.content)}`
	}
	return `data:${document.contentType};base64,${document.content}`;
}
