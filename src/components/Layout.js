import React from "react";
import { Helmet } from "react-helmet";
import Header from "./Header";

const Layout = ({ children, title = "ConForum Admin" }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
