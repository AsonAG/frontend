import { Box, IconButton, Stack, Typography } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { FieldContext } from "../FieldComponent";
import { useContext } from "react";


function toBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      try {
        const [_, base64] = event.target.result.split(";");
        resolve(base64.slice(7));
      }
      catch(e) {
        reject(e);
      }
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsDataURL(file);
  });
};


// TODO AJO fix file upload
function FieldValueFileComponent() {
  const { field, isReadonly, displayName, buildCase } = useContext(FieldContext);
  const extensions = field.attributes?.["input.attachmentExtensions"];
  // const required = attributes?.["input.attachment"] === "Mandatory";
  const required = true;

  const uploadFile = async (file) => {
    const data = await toBase64(file);

    setAttachmentFiles((current) => [
      ...current,
      {
        name: file.name,
        contentType: file.type,
        content: data,
      },
    ]);
  };


  const handleUpload = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
  };

  // TODO: refactor color to separate style files
  return (
    <Stack marginLeft="14px" marginBottom="5px">
      <Typography color="rgba(0, 0, 0, 0.6)">
        {field.displayName + (required ? "*" : "")}
      </Typography>
      <Box width="160px">
        <IconButton
          variant="contained"
          component="label"
        >
          <FileUploadOutlinedIcon />
          <input
            type="file"
            onChange={handleUpload}
            accept={extensions}
            multiple
            required={required}
          />
        </IconButton>
      </Box>
    </Stack>
  );
};
export default FieldValueFileComponent;
