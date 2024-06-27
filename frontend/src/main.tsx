import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Signin } from "./pages/Signin/Signin.tsx";
import { Signup } from "./pages/Signup/Signup.tsx";
import { Contests } from "./pages/Contests/Contests.tsx";
import { EditContest } from "./pages/EditContest/EditContest.tsx";
import { Lobby } from "./pages/Lobby/Lobby.tsx";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RecoilRoot>
              <App />
            </RecoilRoot>
          }
        >
          <Route index element={<Contests />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit-contest" element={<EditContest />} />
          <Route path="/lobby/:contest-id" element={<Lobby />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
