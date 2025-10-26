import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Balance from "./pages/Balance";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
  <Route path="/main" element={<Main />} />
  <Route path="/balance" element={<Balance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
