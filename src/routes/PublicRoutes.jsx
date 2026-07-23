import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoggedIn(false);
      return;
    }

    fetch("http://localhost:5000/checklogin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setLoggedIn(data.loggedIn))
      .catch(() => setLoggedIn(false));
  }, []);

  if (loggedIn === null) return <div>Loading...</div>;

  if (loggedIn) {
    return <Navigate to="/dahsboardintern" replace />;
  }

  return children;
}

export default PublicRoute;
