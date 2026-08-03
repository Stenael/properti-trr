import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPublic from '../pages/DashboardPublic'
import DashboardIntern from '../pages/DashboardIntern'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Sale from '../pages/Sale'
import Rent from '../pages/Rent'
import Question from '../pages/Question'
import Promotion from '../pages/Promotion'
import Profile from '../pages/Profile'
import DetailPublic from '../pages/DetailPublic'
import Nonaktif from '../pages/Nonaktif'
import Edit from '../pages/Edit'
import Payment from '../pages/Payment'
import PublicRoute from '../routes/PublicRoutes'
import PrivateRoute from '../routes/PrivateRoutes'

function MainMenu() {
  return (
    <BrowserRouter>
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
          path="/nonaktif"
          element={
            <PrivateRoute>
              <Nonaktif />
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

        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/question" element={<Question />} />
        <Route path="/property/:id" element={<DetailPublic />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainMenu;