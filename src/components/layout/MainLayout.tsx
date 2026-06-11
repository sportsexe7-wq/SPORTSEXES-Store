import { Outlet } from 'react-router-dom'
// import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'
import { ScrollToTop } from './ScrollToTop'
import { Header } from './Header'                                                                                                                                                                       

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
