import { FilterAlt } from "@mui/icons-material";
import { Badge, FormControl, FormControlLabel, FormLabel, IconButton, IconButtonProps, Radio, RadioGroup, Stack, SxProps, Theme, Typography } from "@mui/material";
import * as Popover from '@radix-ui/react-popover';
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { IdType } from "../models/IdType";
import { atom, useAtom } from "jotai";
import { useRouteLoaderData } from "react-router-dom";
import { PayrunPeriodLoaderData } from "./PayrunPeriodLoaderData";
import { PayrollTableContext } from "./Dashboard";

export const FilterButton = React.forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { state } = useContext(PayrollTableContext);
  const filterActive = state.salaryType !== null;
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Badge badgeContent={filterActive ? 1 : 0} color="primary" overlap="circular">
          <IconButton color={filterActive ? "primary" : undefined} ref={ref} {...props}>
            <FilterAlt />
          </IconButton>
        </Badge>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content asChild align="end">
          <Stack spacing={2} borderRadius={2} mx={2} p={2} sx={popoverSx} alignItems="start">
            <SalaryTypeSection />
          </Stack>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

  )
})

function SalaryTypeSection() {
  const { state, dispatch } = useContext(PayrollTableContext);
  const { salaryTypesSet } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  const { t } = useTranslation();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = (event.target as HTMLInputElement).value;
    dispatch({ type: "set_salary_type", salaryType: value === "all" ? null : value });
  };

  return (
    <FormControl>
      <FormLabel>{t("Salary type")}</FormLabel>
      <RadioGroup
        value={state.salaryType ?? "all"}
        onChange={handleChange}
      >
        <FormControlLabel value="all" control={<Radio />} label={t("All")} />
        {
          salaryTypesSet.map(type => (
            <FormControlLabel key={type} value={type} control={<Radio />} label={type} />
          ))
        }
      </RadioGroup>
    </FormControl>);
}

const popoverSx: SxProps<Theme> = {
  border: 1,
  borderColor: "divider",
  bgcolor: theme => theme.palette.background.default,
  overflow: "hidden",
  zIndex: theme => theme.zIndex.appBar
};

export type SalaryTypeFilter = Record<IdType, string>
export const salaryTypeFilterAtom = atom<SalaryTypeFilter>({});

export function useSalaryTypeFilterAtom(payrunPeriodId: IdType): [string, (value: string) => void] {
  const [filter, setFilter] = useAtom(salaryTypeFilterAtom);
  function setSalaryFilter(salaryFilter: string) {
    setFilter({ ...filter, [payrunPeriodId]: salaryFilter })
  }
  return [filter[payrunPeriodId] ?? "all", setSalaryFilter];
}
