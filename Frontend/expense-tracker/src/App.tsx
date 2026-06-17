
import React from "react";
import LoginForm from "./components/LoginForm.jsx";
import Dashboard from "./components/Dashboard.jsx";


function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      setIsLoggedIn(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    })
    .catch(() => {
      setIsLoggedIn(false);
    })
  }, []);

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  };

  return (
    <div>
      <h1>Expense Tracker</h1>

      {isLoggedIn ? (
        <Dashboard setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;

