import { Autocomplete, Box, createFilterOptions, TextField, Typography } from "@mui/material";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { WageTypeControllingLoaderData } from "./WageTypeControlling";
import { LookupValue } from "../models/LookupSet";

type WageTypeAccountPickerProps = {
  value: LookupValue | null,
  onChange: (value: LookupValue | null) => void
}

const filterOptions = createFilterOptions({
  stringify: (option: LookupValue) => option.key + option.value,
});


export function WageTypeAccountPicker2() {
  return <Typography>Test</Typography>
}
export function WageTypeAccountPicker({ value, onChange }: WageTypeAccountPickerProps) {
  const { accountMaster } = useLoaderData() as WageTypeControllingLoaderData;

  return (
    <Autocomplete
      value={value}
      options={accountMaster.values}
      filterOptions={filterOptions}
      renderInput={(params) => <TextField {...params} />}
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
      size="small"
    >
    </Autocomplete>
  )
}
