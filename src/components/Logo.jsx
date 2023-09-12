import { Link } from "react-router-dom";
import { useMatches } from "react-router-dom";


export default function Logo() {
  const matches = useMatches();

  const location = matches ? matches[0].pathname : "/";

  return (
    <Link to={location}>
      <img
          alt="logo"
          height={48}
          src="/logo512.png"
          style={{ cursor: "pointer" }}
        />
    </Link>
  );
}
