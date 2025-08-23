import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../apis/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res: any = await login(data);
      if (res?.data?.status === 200) {
        localStorage.setItem("token", res?.data?.token);
        toast.success(res?.data?.message);
        navigate("/products");
      } else toast.error(res?.error?.data?.message ?? "Invalid credentials");
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white font-bold">WS</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Women's Street
            </h1>
            <p className="text-slate-600">Admin Dashboard</p>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">
            Sign in to your account
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Access your fashion store management dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="block font-medium text-slate-700 text-sm">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="admin@womensstreet.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email"
                    }
                  })}
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">{errors.email.message as string}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-slate-700 text-sm">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="w-full h-12 pl-10 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {passwordVisible ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">{errors.password.message as string}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-lg px-6 py-2.5 hover:from-blue-700 hover:to-slate-800 transition-all duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Admin Notice */}
          <div className="text-center pt-6 border-t border-slate-200 mt-6">
            <p className="text-xs text-slate-500">
              This is an admin-only portal for Women's Street store management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;