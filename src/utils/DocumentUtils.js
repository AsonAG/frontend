export function getDataUrl(document) {
  return `data:${document.contentType};base64,${document.content}`
}
