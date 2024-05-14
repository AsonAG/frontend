import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export function ScrollToTop() {
	const { search } = useLocation();

	useEffect(() => {
		document.body?.scrollTo(0, 0);
	}, [search]);

	return null;
}
