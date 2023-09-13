import { Link } from "react-router-dom";
import { useMatches } from "react-router-dom";


export default function Logo() {
  const matches = useMatches();

  const location = matches ? matches[0].pathname : "/";

  return (
    <Link to={location} style={{height: 32}} >
      <img
          alt="logo"
          height={32}
          src="/logo512.png"
          style={{ cursor: "pointer" }}
        />
    </Link>
  );
}
