import { Suspense } from "react";
import { Loading } from "../components/Loading";
import { ErrorView } from "../components/ErrorView";
import { Await, useLoaderData } from "react-router-dom";

export function AsyncDataRoute({ children }) {
  const routeData = useLoaderData();
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={routeData.data} errorElement={<ErrorView />}>
        { children }
      </Await>
    </Suspense>
  );
}