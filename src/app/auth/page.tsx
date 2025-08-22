"use client";

import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div>
      <div>
        <h2>{isLogin ? "Login" : "SignUp"}</h2>

        {isLogin ? <LoginForm /> : <SignupForm />}

        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <form>
      <input
        type="email"
        placeholder="Email"
      />
      <input
        type="password"
        placeholder="Password"
      />
      <button
        type="submit"
      >
        Login
      </button>
    </form>
  );
}

function SignupForm() {
  return (
    <form >
      <input
        type="text"
        placeholder="Full Name"
      />
      <input
        type="email"
        placeholder="Email"
      />
      <input
        type="password"
        placeholder="Password"
      />
      <input
        type="password"
        placeholder="Confirm Password"
      />
      <button
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
}
