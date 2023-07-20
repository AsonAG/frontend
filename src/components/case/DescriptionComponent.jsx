import { Box, Tooltip } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import DescriptionText from "./DescriptionText";

export function DescriptionComponent({ description, fieldKey }) {
  return (
    <Box>
      {description ? (
        <Tooltip
          arrow
          title={DescriptionText(description, fieldKey)}
          placement="top"
        >
          <HelpOutlineOutlinedIcon small color="secondary" />
        </Tooltip>
      ) : (
        <div></div>
      )}
    </Box>
  );
}