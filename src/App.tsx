import { useState } from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Results from "./Results";
import NoMatch from "./NoMatch";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="results" element={<Results />} />

          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
