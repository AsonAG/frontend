import { Autocomplete, Box, createFilterOptions, TextField, Typography } from "@mui/material";
import React from "react";
import { IdType } from "../models/IdType";
import { useLoaderData } from "react-router-dom";
import { WageTypeControllingLoaderData } from "./WageTypeControlling";
import { LookupValue } from "../models/LookupSet";

type WageTypeAccountPickerProps = {
  lookupValueId?: IdType
}

const filterOptions = createFilterOptions({
  stringify: (option: LookupValue) => option.key + option.value,
});

export function WageTypeAccountPicker({ lookupValueId }: WageTypeAccountPickerProps) {
  const { accountMaster } = useLoaderData() as WageTypeControllingLoaderData;
  return (
    <Autocomplete
      options={accountMaster.values}
      filterOptions={filterOptions}
      renderInput={
        (params) => <TextField {...params} />
      }
      getOptionLabel={option => option.key}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={key} component="li" {...optionProps} sx={{ gap: 1 }}>
            <Typography width={70} display="inline-block">{option.key}</Typography>
            <Typography width={400} display="inline-block">{option.value}</Typography>
          </Box>
        )
      }}
      size="small"
      slotProps={{
        popper: {
          placement: "bottom-start",
          style: {
            width: 'fit-content'
          }
        }
      }}
    >
    </Autocomplete>
  )
}
