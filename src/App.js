import { useState, createContext  } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Dossier from "./scenes/dossier";
import Tasks from "./scenes/tasks";
import Reporting from "./scenes/reporting";
import CaseForm from "./scenes/global/case/CaseForm";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { height } from "@mui/system";
import CompanyCases from "./scenes/companyCases";
import SubmitionFeedback from "./scenes/global/case/submitionFeedback";

export const UserContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [caseName, setCaseName] = useState("");

  const userContext = {
    loaded: false,
    success: true,
    userId: ""
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns }>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />

            <UserContext.Provider value={userContext}> 
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks updateCaseName={setCaseName} />} />
                <Route path="/dossier" element={<Dossier />} />
                <Route path="/reporting" element={<Reporting />} />
                <Route path="/case" element={<CaseForm caseName={caseName} />} />
                <Route path="/company" element={<CompanyCases updateCaseName={setCaseName} />} />
                <Route path="/status" element={<SubmitionFeedback />} />
              </Routes>
            </UserContext.Provider>

          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </LocalizationProvider>
  );
}

export default App;
