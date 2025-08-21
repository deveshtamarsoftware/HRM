import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png"; // Update path as needed

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg')`,
      }}
    >
      {/* White overlay for blur effect */}
      <div className="absolute inset-0 bg-white/60"></div>

      {/* Dark semi-transparent splash box */}
      <div className="relative p-10 rounded-2xl shadow-2xl bg-black/30 backdrop-blur-md text-center text-white max-w-md w-full">
        <div className="flex justify-center mb-4 animate-pulse">
          <img src={logo} alt="HRMS Logo" className="h-16" />
        </div>
        <h1 className="text-4xl font-bold mb-6">HRMS Portal</h1>

        {/* Rotating circle loader */}
        <div className="mx-auto h-10 w-10 border-4 border-white/50 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default SplashScreen;
