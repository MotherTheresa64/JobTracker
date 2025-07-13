// src/pages/Auth.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import { toast } from "react-hot-toast";

const Auth = () => {
  const { login, signup } = useAuthContext();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Login successful!");
      } else {
        await signup(email, password);
        toast.success("Account created!");
      }
      navigate("/dashboard");
    } catch {
      toast.error("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {isLogin ? "Login to EzTracker" : "Create a New Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-400 underline hover:text-purple-300 transition"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
