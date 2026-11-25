import { Link } from "react-router";
import { useMatches } from "react-router";

export default function Logo({ paddingLeft }) {
	const matches = useMatches();

	const location = matches ? matches[0].pathname : "/";

	return (
		<Link to={location} style={{ height: 32, paddingLeft }}>
			<img
				alt="logo"
				height={32}
				src="/logo512.png"
				style={{ cursor: "pointer" }}
			/>
		</Link>
	);
}
