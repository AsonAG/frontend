import { useContext } from "react";
import { Tooltip, styled } from "@mui/material";
import { HtmlContent } from "../../HtmlContent";
import { Info } from "@mui/icons-material";
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogTrigger } from "../../ResponsiveDialog";
import { FieldContext } from "./Field";

const ButtonBox = styled('div')(({theme}) => 
  theme.unstable_sx({
    border: 1,
    borderRadius: 1,
    borderColor: theme.palette.inputBorder,
    width: 37,
    height: 37,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.text.secondary
  })
);

export function FieldDescription() {
	const { field } = useContext(FieldContext);
  const { description, displayName } = field;
  if (!description) {
    return null;
  }

  return (
    <ResponsiveDialog title={displayName}>
      <ResponsiveDialogTrigger>
        <Tooltip arrow title={<HtmlContent content={description} />} placement="top">
          <ButtonBox>
            <Info/>
          </ButtonBox>
        </Tooltip>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <HtmlContent content={description} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
