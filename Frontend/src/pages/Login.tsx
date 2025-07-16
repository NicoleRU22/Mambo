import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Función para enviar el formulario de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loggedUser = await login(email, password);
      console.log("👤 Usuario logueado:", loggedUser);

      if (loggedUser) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Bienvenido de nuevo.",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          if (loggedUser.role?.toLowerCase() === "admin") {
            navigate("/admin");
          } else {
            navigate("/catalog");
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Correo o contraseña incorrectos.",
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al intentar iniciar sesión.",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return email && password;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-white hover:text-gray-900 transition-colors duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>

        <Card className="shadow-2xl border-0 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform transform hover:rotate-12">
              <img
                src="https://i.pinimg.com/736x/97/42/c1/9742c1036aa6d57acaf7250eb365ff82.jpg"
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <CardTitle className="text-3xl font-semibold text-gray-900">
              Bienvenido!
            </CardTitle>
            <p className="text-gray-400 mt-2 text-sm">
              Inicia sesión en tu cuenta de Mambo Petshop
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-lg font-medium text-gray-700"
                >
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-lg font-medium text-gray-700"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Recordarme
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="text-sm text-primary-600 hover:text-primary-700 p-0 transition-colors"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition duration-200"
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/register")}
                  className="text-primary-600 hover:text-primary-700 p-0 font-medium transition-colors"
                  disabled={isLoading}
                >
                  Regístrate aquí
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
