import React, { } from "react";
import {
  useLoaderData
} from "react-router-dom";
import { Paper, Stack } from "@mui/material";
import { CaseTask } from "../components/CaseTask";
import { AvailableCase } from "../models/AvailableCase";

export function OnboardingView() {
  const data = useLoaderData() as Array<AvailableCase>;
  if (data.length === 0)
    return;
  return (
    <Stack component={Paper} variant="outlined">
      {data.map((c: AvailableCase) => (
        <CaseTask key={c.id} _case={c} type="O" path={encodeURIComponent(c.name)} />
      ))}
    </Stack>
  );
}
