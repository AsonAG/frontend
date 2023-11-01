import { React } from "react";
import { useAsyncValue, Link } from "react-router-dom";
import { Stack, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Centered } from "../Centered";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { ContentLayout } from "../ContentLayout";

export function AsyncCaseTable() {
  return (
    <ContentLayout title="New event">
      <AsyncDataRoute>
        <CaseTable />
      </AsyncDataRoute>
    </ContentLayout>
  );
}

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
          <Typography gutterBottom variant="h3" fontWeight="bold" component="div">
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

function CaseTable() {
  const cases = useAsyncValue();
  const sorted = cases.toSorted(sortByDisplayName);
  const { t } = useTranslation();

  if (!sorted.length) {
    return <Centered><Typography>{t("No data")}</Typography></Centered>
  }

  return (
    <Stack spacing={3} direction="row" flexWrap="wrap">
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