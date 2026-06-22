import React from "react";
import { loginUser, registerUser } from "../services/loginService";
import type { LoginFormProps } from "../types/componentProps";
import type { LoginErrors } from "../types/errors";

function LoginForm({ setIsLoggedIn } : LoginFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [errors, setErrors] = React.useState<LoginErrors>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSignup, setIsSignup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleLogin = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    let newErrors: LoginErrors = {
      email: "",
      password: "",
    };

    // Email and Password Validation
    if (email === "") newErrors.email = "Email required";
    if (password === "") newErrors.password = "Password required";

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {

    
      const response = await loginUser(
        email,
        password,
      );

        if (!response) {
        console.log("Login Request Failed");
        return;
      };

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        setIsLoggedIn(true);
      } else {
        setMessage(data.message || "Login Failed");
        return;
      }
    }
  };

  const handleSignUp = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    let newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (email === "") newErrors.email = "Email required";
    if (password.length < 6) newErrors.password = "Min 6 characters";

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      const response = await registerUser(
        email,
        password,
      );

      if (!response) {
        console.log("Sign Up Failed");
        return;
      };

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        setIsLoggedIn(true);
      } else {
        setMessage(data.message || "Sign Up Failed");
        return;
      }
    }
  };

  return (
    <form onSubmit={isSignup ? handleSignUp : handleLogin}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <p>{errors.email}</p>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <p>{errors.password}</p>

      {isSignup && (
        <>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <p>{errors.confirmPassword}</p>
        </>
      )}

      <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>

      <button type="button" onClick={() => setIsSignup(!isSignup)}>
        Switch Mode
      </button>

      <p>{message}</p>
    </form>
  );
}

export default LoginForm;
