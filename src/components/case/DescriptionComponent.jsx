import { Box, Tooltip } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";


const isHtml = RegExp.prototype.test.bind(/<\/?[a-z][\s\S]*>/i);

export function DescriptionComponent({ description }) {
  
  if (!description) {
    return <div></div>;
  }

  // TODO: refactor color to separate style files
  const content = isHtml(description) ? <Markup content={description} /> : <>{description}</>;

  return (
    <Box>
        <Tooltip arrow title={content} placement="top">
          <HelpOutlineOutlinedIcon small color="secondary" />
        </Tooltip>
    </Box>
  );
}