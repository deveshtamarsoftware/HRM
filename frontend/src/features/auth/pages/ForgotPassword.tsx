import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import AuthFormLayout from "../../../components/AuthFormLayout";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword() {
  return (
    <AuthFormLayout
      title="Forgot Password"
      footer={
        <p className="text-sm text-white/80">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-300 hover:text-blue-400">
            Login
          </Link>
        </p>
      }
    >
      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotPasswordSchema}
        onSubmit={async (values) => {
          try {
            console.log("Reset link sent to:", values.email);
            // Call API here later
          } catch (err) {
            console.error("Error sending reset email:", err);
          }
        }}
      >
        {() => (
          <Form className="space-y-4">
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

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-semibold text-white shadow-lg disabled:opacity-50"
            >
              Send Reset Link
            </button>
          </Form>
        )}
      </Formik>
    </AuthFormLayout>
  );
}
