import React from "react";

function LoginForm({ setIsLoggedIn }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [isSignup, setIsSignup] = React.useState(false);
  const [message, setMessage] = React.useState("");
  
  const handleLogin = async (e) => {
    e.preventDefault();

    let newErrors = {
      email: "",
      password: "",
      confirmPassword: ""
    };
    // Email and Password Validation
    if (email === "") newErrors.email = "Email required";
    if (password.length < 6) newErrors.password = "Min 6 characters";

    if (isSignup && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    
    if (!newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      try {
        const url = isSignup

        ? "http://localhost:3000/api/auth/register"
        : "http://localhost:3000/api/auth/login";

        const response = await fetch(url, {
          method: "POST",
          headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      


        if (response.ok) {
          const data = await response.json();
        
          localStorage.setItem("token", data.token);

          setIsLoggedIn(true);
        } else {
          setMessage(data.message || "Login failed");
        }

      } catch (error) {
        setMessage("Server error");
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <p>{errors.email}</p>

      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <p>{errors.password}</p>

      {isSignup && (
        <>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
          <p>{errors.confirmPassword}</p>
        </>
      )}

      <button type="submit">
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <button type="button" onClick={() => setIsSignup(!isSignup)}>
        Switch Mode
      </button>

      <p>{message}</p>
    </form>
  );
}

console.log("LOGIN FORM LOADED");

export default LoginForm;