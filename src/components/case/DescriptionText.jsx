import { Box, Button, Stack, Typography } from "@mui/material";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useContext } from "react";
import { Markup } from "interweave";

const DescriptionText = (description, fieldKey) => {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(description);

  // TODO: refactor color to separate style files
  return (
    description &&
    (isHtml ? (
      <Markup content={description} key={"description_" + fieldKey} />
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
      <>{description}</>
    ))
  );
};

export default DescriptionText;
