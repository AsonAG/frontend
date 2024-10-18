export function getDataUrl(document) {
	if (document === null) return null;
	return `data:${document.contentType};base64,${document.content}`;
}
