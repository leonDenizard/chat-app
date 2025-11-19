import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Chat from "./pages/Chat";
import { UserProvider } from "./context/UserProvider";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
