import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../supabaseClient";
import Navigation from '../nondashboard/Landing/Navigation';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const email = formData.email.trim();
    const password = formData.password.trim();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Invalid login credentials. Please try again.");
        console.error("Login error:", error);
        setLoading(false);
        return;
      }

      const { user } = data;
      const role = user?.user_metadata?.role;
      const normalizedRole = role.toLowerCase();

      console.log('user.user_metadata:', user.user_metadata);
      console.log('role to be inserted:', role);

      if (!role) {
        setErrorMessage("No role assigned to this user.");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileFetchError && profileFetchError.code !== "PGRST116") {
        setErrorMessage("Error checking profile: " + profileFetchError.message);
        setLoading(false);
        return;
      }

      if (!profile) {
        console.log('Inserting profile with role:', normalizedRole);
        const { error: profileInsertError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              full_name: user.user_metadata.fullName,
              role: normalizedRole,
              email: user.email,
            },
          ]);
        if (profileInsertError) {
          setErrorMessage("Error creating profile: " + profileInsertError.message);
          setLoading(false);
          return;
        }
      }

      // Role-based navigation
      if (normalizedRole === "farmer") navigate("/Farmer/hero-section");
      else if (normalizedRole === "customer") navigate("/Customer/customer-dashboard");
      else if (normalizedRole === "investor") navigate("/Investor/investor-dashboard");
      else setErrorMessage("Unrecognized role. Contact admin.");
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="auth-bg">
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <div className="circle-3"></div>
        <div className="circle-4"></div>
        <div className="circle-5"></div>

        <div className="auth-form-container">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-600 mb-6">
              Or{" "}
              <Link to="/signup" className="link">
                create a new account
              </Link>
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {errorMessage && (
              <div className="text-sm mt-2 text-red-600">{errorMessage}</div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;