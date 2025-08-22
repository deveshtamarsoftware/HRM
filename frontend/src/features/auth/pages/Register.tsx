import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import backgroundImage from "../../../assets/Office.jpg";

// Validation schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function Register() {
  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Card container */}
      <div className="relative p-8 rounded-2xl shadow-lg bg-white/10 backdrop-blur-lg text-white max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="HRMS Logo" className="h-16" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {/* Form */}
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {() => (
            <Form className="space-y-4">
              {/* Full Name */}
              <div>
                <Field
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-300 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-300 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-300 text-sm mt-1"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-300 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-semibold text-white shadow-lg"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-white/80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-300 hover:text-blue-400 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
