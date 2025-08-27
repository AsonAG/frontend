import { useDocumentTitle } from "usehooks-ts";

const appName = import.meta.env.VITE_APP_NAME;

export function useAppDocumentTitle(title?: string): void {
	let documentTitle: string;

	if (title) {
		documentTitle = `${appName} - ${title}`;
	} else {
		documentTitle = appName;
	}

	useDocumentTitle(documentTitle);
}
