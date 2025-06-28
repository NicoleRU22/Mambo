import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import AdminDashboard from "./components/admin/AdminDashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import AboutUs from "./pages/AboutUs";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Ofertas from "./pages/Ofertas";
import Devoluciones from "./pages/Devoluciones";
import TermsOfService from "./pages/TermsOfService";
import Newsletter from "./pages/Newsletter";

// Importar las nuevas páginas
import TermsAndConditions from "./pages/Terms-and-conditions";
import PrivacyPolicy from "./pages/Privacy-policy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* ❌ QUITA el <BrowserRouter> aquí */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/devoluciones" element={<Devoluciones />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* ❌ FIN del BrowserRouter */}
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
