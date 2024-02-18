import React from "react";
import { useAsyncValue, useLoaderData, useSearchParams } from "react-router-dom";
import { Stack, Pagination } from "@mui/material";
import { useIsMobile } from "../hooks/useIsMobile";

function usePageSearchParam(): [number, (number: number) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const setPage = (pageNumber: number) => setSearchParams(o => ({...o, page: pageNumber}));
  const page = searchParams.get("page") || 1;
  return [Number(page), setPage];
}

export function PaginatedContent({children}) {
  const { count } = useAsyncValue() as {count: number};
  const { pageCount } = useLoaderData() as {pageCount: number};
  const [page, setPage] = usePageSearchParam();
  const siblingCount = useIsMobile() ? 0 : 1;
  return (
    <Stack spacing={3}>
      {children}
      <Pagination
        shape="rounded"
        count={Math.ceil(count / pageCount)}
        page={page}
        onChange={(_, page) => setPage(page)}
        sx={{alignSelf: "center"}}
        siblingCount={siblingCount}/>
    </Stack>
  )
}
