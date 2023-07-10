import { Box, Button, Stack, Typography } from "@mui/material";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useContext } from "react";
import { Markup } from "interweave";

const FieldDescriptionText = (fieldDescription, fieldKey) => {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(fieldDescription);

  // TODO: refactor color to separate style files
  return (
    fieldDescription &&
    (isHtml ? (
      <Markup content={fieldDescription} key={"description_" + fieldKey} />
    ) : (
      // <Typography
      //   key={"description_" + fieldKey}
      //   // color="neutral"
      //   fontSize="0.65em"
      //   fontWeight="400"
      //   color="rgba(0, 0, 0, 0.6)"
      // >
      //   {fieldDescription}
      // </Typography>
      <>{fieldDescription}</>
    ))
  );
};

export default FieldDescriptionText;
