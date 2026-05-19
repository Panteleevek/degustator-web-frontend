"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import AuthProvider from "./AuthProvider";
import UserProvider from "./UserProvider";

const Layout = ({
  children,
  token,
}: {
  children: React.ReactNode;
  token?: string;
}) => {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </Provider>
    </>
  );
};
export default Layout;
