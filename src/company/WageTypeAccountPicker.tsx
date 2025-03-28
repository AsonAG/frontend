import { Autocomplete, Badge, Box, createFilterOptions, SxProps, TextField, Theme, Typography } from "@mui/material";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { WageTypeControllingLoaderData } from "./WageTypeControlling";
import { LookupValue } from "../models/LookupSet";
import { AccountLookupValue, WageTypeDetailed } from "../models/WageType";

type WageTypeAccountPickerProps = {
  wageType: WageTypeDetailed
  accountType: "debitAccountNumber" | "creditAccountNumber"
}

const filterOptions = createFilterOptions({
  stringify: (option: LookupValue) => option.key + option.value,
});


export const WageTypeAccountPicker = memo(function WageTypeAccountPicker({ wageType, accountType }: WageTypeAccountPickerProps) {
  const { accountMaster, accountMasterMap, regulationId, fibuAccountLookup } = useLoaderData() as WageTypeControllingLoaderData;
  const [value, setValue] = useState<LookupValue | null>(null);
  const fetcher = useFetcher();

  const onChange = (value: LookupValue | null) => {
    const accountLookupValue: LookupValue = {
      ...wageType.accountLookupValue,
      key: wageType.wageTypeNumber.toString(),
      value: JSON.stringify({
        creditAccountNumber: wageType.accountLookupValue?.value?.creditAccountNumber,
        debitAccountNumber: wageType.accountLookupValue?.value?.debitAccountNumber,
        [accountType]: value?.key ?? ""
      })
    };
    setValue(value);
    fetcher.submit({
      regulationId,
      lookupId: fibuAccountLookup.id,
      lookupValue: accountLookupValue
    },
      { method: accountLookupValue.id ? "PUT" : "POST", encType: "application/json" });
  }

  useEffect(() => {
    const lookupValue = accountMasterMap.get(wageType.accountLookupValue?.value?.[accountType] ?? "") ?? null;
    setValue(lookupValue);
  }, [wageType.accountLookupValue?.value?.[accountType], accountMasterMap]);

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
          <Badge variant={!(wageType.accountLookupValue?.value?.[accountType]) ? "dot" : "standard"} color="warning" component="div" sx={{ width: "100%" }}>
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
