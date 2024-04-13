import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.succes === false) {
        setLoading(false);
        setError(data.message);
        return;
      } else {
        setError(null);
        navigate("/sign-in");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1
        className="text-3xl text-center font-semibold
      my-7"
      >
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 p-3 uppercase
         text-white hover:opacity-95 
         disabled:opacity-80"
        >
          {loading ? "Loading..." : "sign up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-4 mt-4">
        <p>Have an account?</p>
        <span className="text-blue-700">
          <Link to={"/sign-in"}>Sign in</Link>
        </span>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
    </div>
  );
}
