import { useEffect } from "react";
import { useLocation } from "react-router";
export function ScrollToTop() {
	const { search } = useLocation();

	useEffect(() => {
		document.scrollingElement?.scrollTo(0, 0);
	}, [search]);

	return null;
}
