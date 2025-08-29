"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Change this to your intended page
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return <p>Redirecting...</p>;
  }

  return (
    <div>
      <div>
        <h2>{isLogin ? "Login" : "SignUp"}</h2>

        {isLogin ? <LoginForm /> : <SignupForm />}

        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      alert(res?.error || "Login Failed");
    }
  };

  const handleGoogleLogin = () => {
    signIn("google");
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <hr />
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </>
  );
}

function SignupForm() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    companyname: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (res.ok) {
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (loginRes?.ok) {
        router.push("/dashboard");
      } else {
        alert("Signup successful, but auto-login failed. Please login manually.");
      }
    } else {
      alert(data.error || "Signup Failed");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="username"
        type="text"
        placeholder="Username"
        required
        value={form.username}
        onChange={handleChange}
      />
      <input
        name="firstname"
        type="text"
        required
        placeholder="First name"
        value={form.firstname}
        onChange={handleChange}
      />
      <input
        name="lastname"
        type="text"
        placeholder="Last name"
        value={form.lastname}
        onChange={handleChange}
      />
      <input
        name="companyname"
        type="text"
        placeholder="Company Name"
        value={form.companyname}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={form.password}
        onChange={handleChange}
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        required
        value={form.confirmPassword}
        onChange={handleChange}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
