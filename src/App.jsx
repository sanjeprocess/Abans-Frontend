import React, { useState } from "react";
import PreForm from "./PreForm";
import RegistrationPage from "./RegistrationPage";

function App() {
  const [userData, setUserData] = useState(null);

  if (!userData) {
    return <PreForm onVerified={(data) => setUserData(data)} />;
  }

  return <RegistrationPage preFilledData={userData} />;
}

export default App;