import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ShopPage } from '@/pages/ShopPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { LoginPage } from '@/pages/LoginPage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { VipPage } from '@/pages/VipPage'
import { AccountLayout } from '@/pages/account/AccountLayout'
import { ProfilePage } from '@/pages/account/ProfilePage'
import { OrdersPage } from '@/pages/account/OrdersPage'
import { WishlistPage } from '@/pages/account/WishlistPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'vip', element: <VipPage /> },
      {
        path: 'account',
        element: <AccountLayout />,
        children: [
          { index: true, element: <ProfilePage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'wishlist', element: <WishlistPage /> },
        ],
      },
    ],
  },
])
