import { Box, IconButton, Stack, Typography } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

const FieldValueFileComponent = (
  fieldDisplayName,
  fieldDescription,
  fieldValue,
  fieldKey,
  slotInputProps,
  attributes,
  setAttachmentFiles
) => {
  const extensions = attributes?.["input.attachmentExtensions"];
  // const required = attributes?.["input.attachment"] === "Mandatory";
  const required = true;

  const uploadFile = async (file) => {
    const fileEncoded = await convertBase64(file);
    let [contentType, base64] = fileEncoded.split(";");
    contentType = contentType.slice(5);
    base64 = base64.slice(7);

    setAttachmentFiles((current) => [
      ...current,
      {
        name: file.name,
        contentType: file.type,
        content: base64,
      },
    ]);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        resolve(event.target.result);
        // resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsDataURL(file);
    });
  };

  const handleUpload = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
  };

  // TODO: refactor color to separate style files
  return (
    <Stack marginLeft="14px" marginBottom="5px" key={"stack_" + fieldKey}>
      <Typography color="rgba(0, 0, 0, 0.6)" key={"title_" + fieldKey}>
        {fieldDisplayName + (required ? "*" : "")}
      </Typography>
      <Box width="160px" key={"inputbox_" + fieldKey}>
        <IconButton
          variant="contained"
          component="label"
          key={"uploadbutton_" + fieldKey}
        >
          <FileUploadOutlinedIcon />
          <input
            type="file"
            onChange={handleUpload}
            accept={extensions}
            multiple
            //     hidden
            required={required}
          />
        </IconButton>
      </Box>
    </Stack>
  );
};
export default FieldValueFileComponent;
