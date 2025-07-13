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
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? "Login to EzTracker" : "Create a New Account"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full mt-1 p-2 border rounded"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full mt-1 p-2 border rounded"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
