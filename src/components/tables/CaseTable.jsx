import { React, Suspense } from "react";
import { useOutletContext, Await, useAsyncValue, useLoaderData, Link } from "react-router-dom";
import { Stack, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import Header from "../Header";
import { Loading } from "../Loading";
import { ErrorView } from "../ErrorView";

const styling = {
  flex: "1 1 300px",
  borderRadius: (theme) => theme.spacing(1),
  color: (theme) => theme.palette.text.primary,
  "&:hover": {
    "color": (theme) => theme.palette.primary.main,
    "backgroundColor": (theme) => theme.palette.primary.hover
  }
}

function CaseCard({_case}) {
  return (
    <Card sx={styling}>
      <CardActionArea component={Link} to={encodeURIComponent(_case.name)} sx={{height: "100%"}}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {_case.displayName}
          </Typography>
          {
            _case.description && 
              <Typography variant="body2" color="text.secondary">
                {_case.description}
              </Typography>
          }
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export function CaseTableRoute({defaultTitle}) {
  const title = useOutletContext() || defaultTitle;
  const routeData = useLoaderData();
  return (
    <Stack p={4} spacing={2} sx={{minHeight: "100%"}}>
        <Header title={title} />
        <Suspense fallback={<Loading />}>
            <Await resolve={routeData.data} errorElement={<ErrorView />}>
                <CaseTable />
            </Await>
        </Suspense>
    </Stack>
  );
}


export function CaseTable() {
  const cases = useAsyncValue();
  const sorted = cases.toSorted(sortByDisplayName);
  return (
    <Stack spacing={3} direction="row" useFlexGap flexWrap="wrap">
      {sorted.map(c => <CaseCard key={c.id} _case={c} />)}
    </Stack>
  );
};

function sortByDisplayName(case1, case2) {
  const name1 = case1.displayName.toUpperCase();
  const name2 = case2.displayName.toUpperCase();

  if (name1 < name2) return -1;
  if (name1 > name2) return 1;
  return 0;
}