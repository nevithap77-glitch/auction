import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import ProductListing from './pages/ProductListing'
import BiddingPage from './pages/BiddingPage'
import WishlistPage from './pages/WishlistPage'
import MyOrders from './pages/MyOrders'
import GroupBidding from './pages/GroupBidding'

const hnpTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#7b2fff',
    colorBgBase: '#0d0010',
    colorTextBase: '#ffffff',
    borderRadius: 10,
    fontFamily: "'Outfit', sans-serif",
    colorBorder: 'rgba(123,47,255,0.35)',
    colorBgContainer: 'rgba(30,0,60,0.75)',
    colorBgElevated: '#1a0035',
    colorLink: '#c084fc',
    colorLinkHover: '#a855f7',
  },
  components: {
    Button: {
      colorPrimary: '#7b2fff',
      algorithm: true,
    },
  },
}

export default function App() {
  return (
    <ConfigProvider theme={hnpTheme}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/bidding/:id?" element={<BiddingPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/group-bidding" element={<GroupBidding />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}
