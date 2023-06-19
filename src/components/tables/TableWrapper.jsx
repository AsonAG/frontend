import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import ErrorBar from "../errors/ErrorBar";

const TableWrapper = ({ error, setError, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box 
      height="calc(100vh - 160px)"
      display="flex"
      flexDirection="column"
      sx={{
        "& .MuiDataGrid-root": {
          //   border: "none",
        },
        "& .MuiDataGrid-cell": {
          //   borderBottom: "none",
        },
        "& .name-column--cell": {
          //   color: colors.greenAccent[300],
          marginLeft: "5px",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          color: colors.blueAccent,
          marginLeft: "5px",
          fontWeight: "bold",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.primary[400],
          //   borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[500],
        },
        "& .MuiDataGrid-footerContainer": {
          //   borderTop: "none",
          backgroundColor: colors.primary[500],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.blueAccent} !important`,
        },
      }}
    >
      {error && (
          <ErrorBar error={error} resetErrorBoundary={() => setError(null)} />
        )}
      {children}
    </Box>
  );
};

export default TableWrapper;
