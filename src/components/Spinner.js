import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-red-100 rounded-full"></div>
        <div
          className="absolute top-0 left-0 w-20 h-20 border-4 border-t-transparent animate-spin rounded-full"
          style={{ borderTopColor: "#9B0020" }}
        ></div>
      </div>
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Hold tight!
        </h1>
        <p className="mt-2 text-gray-500 font-medium">
          Redirecting you in{" "}
          <span className="text-red-600 font-bold">{count}</span> second
          {count !== 1 ? "s" : ""}...
        </p>
      </div>
    </div>
  );
};

export default Spinner;
