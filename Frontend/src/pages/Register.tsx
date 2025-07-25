import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = () => {
    setAcceptTerms((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Las contraseñas no coinciden",
        confirmButtonText: "OK",
      });
      return;
    }
    setLoading(true);
    try {
      const success = await register(formData.name, formData.email, formData.password);
      
      if (success) {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Redirigiendo al login...",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Error al registrar usuario",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Error de red o servidor.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      acceptTerms
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
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
              Crear cuenta
            </CardTitle>
            <p className="text-gray-400 mt-2 text-sm">
              Únete a la familia Mambo Petshop
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-medium text-gray-700">
                  Nombre completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-medium text-gray-700">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-lg font-medium text-gray-700">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="rounded"
                  checked={acceptTerms}
                  onChange={handleCheckboxChange}
                  disabled={loading}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  Acepto los{" "}
                  <Button
                    variant="link"
                    onClick={() => navigate("/terms-and-conditions")}
                    className="text-primary-600 hover:text-primary-700 p-0 text-sm"
                    disabled={loading}
                  >
                    términos y condiciones
                  </Button>{" "}
                  y la{" "}
                  <Button
                    variant="link"
                    onClick={() => navigate("/privacy-policy")}
                    className="text-primary-600 hover:text-primary-700 p-0 text-sm"
                    disabled={loading}
                  >
                    política de privacidad
                  </Button>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition duration-200"
                disabled={!isFormValid() || loading}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-primary-600 hover:text-primary-700 p-0 font-medium transition-colors"
                  disabled={loading}
                >
                  Inicia sesión aquí
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
