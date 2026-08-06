import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPublic from '../pages/DashboardPublic'
import DashboardIntern from '../pages/DashboardIntern'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Sale from '../pages/Sale'
import Rent from '../pages/Rent'
import Promotion from '../pages/Promotion'
import Profile from '../pages/Profile'
import DetailPublic from '../pages/DetailPublic'
import Edit from '../pages/Edit'
import PublicRoute from '../routes/PublicRoutes'
import PrivateRoute from '../routes/PrivateRoutes'
import ScrollToTop from '../pages/ScrollToTop'

function MainMenu() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<DashboardPublic />} />
        <Route
          path="/dashboardIntern"
          element={
            <PrivateRoute>
              <DashboardIntern />
            </PrivateRoute>
          }
        />
        <Route
          path="/promotion"
          element={
            <PrivateRoute>
              <Promotion />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <Edit />
            </PrivateRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/property/:id" element={<DetailPublic />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainMenu;