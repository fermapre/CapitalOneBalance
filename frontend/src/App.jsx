import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Balance from "./pages/Balance";
import Landing from "./components/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        
        {/* Rutas protegidas */}
        <Route path="/main" element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        } />
        <Route path="/balance" element={
          <ProtectedRoute>
            <Balance />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;