import React, { useState, useEffect, useRef } from "react";
import { Upload, LogOut, User, ShieldCheck } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import farmerAvatar from "../assets/farmer-avatar.gif";
import supabase from "../supabaseClient";
import AnimationBackgroundElement from "../nondashboard/Landing/AnimationBackgroundElement";

export default function ProfilePage() {
  const [user, setUser] = useState(null); // Supabase auth user
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const fileRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      console.log("✅ Fetched auth user:", userData?.user);

      if (userErr || !userData?.user) {
        console.error("❌ User not authenticated:", userErr);
        setLoading(false);
        return;
      }

      setUser(userData.user);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (error) {
        console.error("❌ Error fetching profile:", error);
      }

      if (data) {
        console.log("✅ Fetched profile:", data);
        setProfile({
          name: data.full_name || "",
          email: data.email || userData.user.email,
          mobile: data.mobile || "",
          profilePic: data.imageUrl || null,
        });
        setPreview(data.imageUrl || null);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setProfile((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleInput = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    if (!user) {
      alert("❌ User not authenticated");
      return;
    }

    console.log("🔍 Saving profile with:", {
      id: user.id,
      full_name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      imageUrl: preview,
    });

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      imageUrl: preview,
    });

    if (error) {
      console.error("❌ Supabase upsert error:", error);
      alert("❌ Failed to update profile: " + error.message);
    } else {
      alert("✅ Profile updated");
      localStorage.setItem("agri-user", JSON.stringify(profile));
    }
  };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("❌ Passwords don't match");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwords.new,
    });

    if (error) {
      console.error("❌ Error changing password:", error);
      alert("❌ Failed to change password");
    } else {
      alert("✅ Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("agri-user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-10 text-red-600">
        ❌ You must be logged in to view your profile.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white flex justify-center items-center px-4 py-10 overflow-hidden">
      <AnimationBackgroundElement />

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 relative z-10">
        <div className="flex justify-center mb-6">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-green-600 shadow-lg cursor-pointer hover:scale-105 transition"
            onClick={() => fileRef.current.click()}
          >
            <img
              src={
                preview && (typeof preview === "string") && (preview.startsWith("data:image/") || preview.startsWith("http"))
                  ? preview
                  : farmerAvatar
              }
              alt="Profile Avatar"
              className="object-cover w-full h-full"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileRef}
              onChange={handleUpload}
            />
            <div className="absolute bottom-0 right-0 bg-green-600 p-1.5 rounded-full">
              <Upload size={18} className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex justify-around mb-6">
          {[
            { key: "profile", label: "Profile", icon: <User size={16} /> },
            { key: "security", label: "Security", icon: <ShieldCheck size={16} /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`text-sm px-4 py-2 rounded-full font-medium flex items-center gap-2 transition ${
                activeTab === key
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <span>{label}</span> {icon}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="grid gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={profile.name}
              onChange={handleInput}
              className="w-full bg-gray-50 px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profile.email}
              onChange={handleInput}
              className="w-full bg-gray-50 px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="tel"
              name="mobile"
              placeholder="+91 9876543210"
              value={profile.mobile}
              onChange={handleInput}
              className="w-full bg-gray-50 px-4 py-2 rounded-lg border border-gray-300"
            />
            <button
              onClick={saveProfile}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Save Profile
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="grid gap-4">
            <input
              type="password"
              name="current"
              placeholder="Current Password"
              value={passwords.current}
              onChange={handlePasswordChange}
              className="w-full bg-gray-50 px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="password"
              name="new"
              placeholder="New Password"
              value={passwords.new}
              onChange={handlePasswordChange}
              className="w-full bg-gray-50 px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="password"
              name="confirm"
              placeholder="Confirm Password"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              className="w-full bg-gray-50 px-4 py-2 rounded-lg border border-gray-300"
            />
            <button
              onClick={changePassword}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Change Password
            </button>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <a href="#" className="text-gray-600 hover:text-green-500 text-xl transition">
            <FaFacebookF />
          </a>
          <a href="#" className="text-gray-600 hover:text-green-500 text-xl transition">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-600 hover:text-green-500 text-xl transition">
            <FaInstagram />
          </a>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogout}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}