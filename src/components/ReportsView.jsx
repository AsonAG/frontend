import { Link, Outlet } from "react-router-dom";

export function ReportsView() {
  return <>
    <Link to="test">Testing</Link>
    <Outlet />
  </>
}
