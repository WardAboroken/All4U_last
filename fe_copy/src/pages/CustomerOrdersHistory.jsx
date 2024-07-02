import React, { useState } from "react";
import "./css/index.css"
import "./css/insideHeader.css"
import InsideHeader from "../components/InsideHeader";
import Footer from "../components/Footer";

function CustomerOrdersHistory() {
  const [name, setName] = useState("");
  const [userName, setUseName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <body>
      <InsideHeader />

      <Footer />
    </body>
  );
}

export default CustomerOrdersHistory;
