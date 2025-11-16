import { useEffect, useState } from "react";
import useIsMobile from "./hooks/useIsMobile";
import { Route, Routes } from "react-router";
import RegisterScreen from "./Screens/RegisterScreen/RegisterScreen";
import { LoginScreen } from "./Screens/LoginScreen/LoginScreen";
import AuthMiddleware from "./Middlewares/AuthMiddleware";

import { RecoverPasswordScreen } from "./Screens/Auth/RecoverPasswordScreen";
import MainLayout from "./features/layouts/MainLayout";

import GroupChatScreen from "./features/groups/screens/GroupChatScreen";

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/recover" element={<RecoverPasswordScreen />} />

      <Route element={<AuthMiddleware />}>

        <Route path="/home" element={<MainLayout />} />
        <Route path="/chat/:chatId" element={<MainLayout />} />
        <Route path="/groups/:groupId" element={<MainLayout />} />

      </Route>

    </Routes>
  );
}

export default App;
