import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Chat from "./pages/Chat";
import { UserProvider } from "./context/UserProvider";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Toaster/>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
