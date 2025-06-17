import { Autocomplete, Badge, Box, createFilterOptions, SxProps, TextField, Theme, Typography } from "@mui/material";
import React, { memo, useContext, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { WageTypeControllingLoaderData } from "./WageTypeControllingLoaderData";
import { LookupValue } from "../models/LookupSet";
import { WageTypeSettingsContext } from "./WageTypeControlling";
import { WageType } from "../models/WageType";

type WageTypeAccountPickerProps = {
  wageType: WageType
  accountType: "debitAccountNumber" | "creditAccountNumber"
}

const filterOptions = createFilterOptions({
  stringify: (option: LookupValue) => option.key + option.value,
});


export const WageTypeAccountPicker = memo(function WageTypeAccountPicker({ wageType, accountType }: WageTypeAccountPickerProps) {
  const { accountMaster } = useLoaderData() as WageTypeControllingLoaderData;
  const { state, dispatch } = useContext(WageTypeSettingsContext);
  const wageTypeNumber = wageType.wageTypeNumber.toString();
  const assignment = state.accountAssignments[wageTypeNumber]?.[accountType];

  const value = useMemo(() => accountMaster.values.find(x => x.key === assignment) ?? null, [assignment, accountMaster.values]);
  const onChange = (value: LookupValue | null) => {
    dispatch({ type: "set_account", wageTypeNumber, value: value?.key ?? null, kind: accountType })
  }

  if (wageType.attributes?.["Accounting.Relevant"] !== "Y") {
    return null;
  }

  return (
    <Autocomplete
      value={value}
      options={accountMaster.values}
      filterOptions={filterOptions}
      renderInput={(params) => {
        return (
          <Badge variant={!assignment ? "dot" : "standard"} color="warning" component="div" sx={{ width: "100%" }}>
            <TextField {...params} />
          </Badge>
        )
      }}
      onChange={(_, value, __, ___) => onChange(value)}
      getOptionLabel={option => `${option.key} ${option.value}`}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={key} component="li" {...optionProps} sx={{ gap: 1 }}>
            <Typography width={70} display="inline-block">{option.key}</Typography>
            <Typography display="inline-block">{option.value}</Typography>
          </Box>
        )
      }}
      slotProps={{
        popper: {
          placement: "bottom-start",
          style: {
            width: "fit-content"
          }
        }
      }}
      sx={autoCompleteSx}
      size="small"
    >
    </Autocomplete>
  )
}
);

const autoCompleteSx: SxProps<Theme> = {
  ".MuiAutocomplete-input": {
    paddingTop: "0 !important",
    paddingBottom: "0 !important"
  }
}
