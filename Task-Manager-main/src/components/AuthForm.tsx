import React, { useState, FormEvent } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          role: "user",
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
      <div className="flex w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-lg">
        {/* Left Side: Logo & Create Account */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-10 relative">
          <div className="flex flex-col items-center">
            {/* Placeholder logo: you can replace with your own */}
            <span className="text-6xl mb-6">🗂️</span>
            <h2 className="text-3xl font-bold text-white mb-2">Task Manager</h2>
            <p className="text-white/80 mb-8 text-center">A productivity app for managing tasks, projects, and deadlines.</p>
            <button
              className="mt-4 px-6 py-2 bg-white/20 text-white border border-white/30 rounded-full hover:bg-white/30 transition font-semibold"
              onClick={() => setIsLogin(false)}
              disabled={!isLogin}
            >
              Create an account
            </button>
          </div>
          {/* Decorative overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        </div>
        {/* Right Side: Sign In/Up Form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
              {isLogin ? "Sign in" : "Create an account"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:shadow-lg bg-white/80"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:shadow-lg bg-white/80"
                required
              />
            </div>
            {error && <div className="text-red-500 mb-2 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition mb-4 shadow-lg"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
            </button>
            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Create an account" : "Already have an account? Sign in"}
              </button>
              {/* Placeholder for forgot password */}
              {isLogin && <span className="text-gray-400 cursor-not-allowed">Forgot password?</span>}
            </div>
            {/* Social login placeholder */}
            {/* <div className="mt-8 flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-xl font-semibold hover:bg-blue-200 transition">
                <span>Sign in with Facebook</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-xl font-semibold hover:bg-blue-100 transition">
                <span>Sign in with Twitter</span>
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm; 