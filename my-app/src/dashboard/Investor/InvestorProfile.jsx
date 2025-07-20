import React, { useState, useRef, useEffect } from "react";
import { Upload, LogOut, User, Lock, Facebook, Twitter, Instagram } from "lucide-react";
import farmingBg2 from "../../assets/farming-bg2.jpg";
import supabase from "../../supabaseClient";
import InvestorNavbar from "./InvestorNavbar";

export default function InvestorProfile() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const fileRef = useRef(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [investorName, setInvestorName] = useState("Investor");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error("Error fetching user:", authError);
        // Handle not logged in case, e.g., redirect
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(`full_name, mobile, profile_pic_url`)
        .eq("id", authUser.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
      
      const userData = {
        name: profile?.full_name || authUser.user_metadata?.fullName || 'Investor',
        email: authUser.email,
        mobile: profile?.mobile || "9876543210",
        profilePic: profile?.profile_pic_url,
      };

      setUser(userData);
      setPreview(userData.profilePic);
      setInvestorName(userData.name);
    };

    fetchUserProfile();
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setUser({ ...user, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleInput = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    // Save profile changes to Supabase
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        alert("User not authenticated.");
        return;
      }
      const updates = {
        full_name: user.name,
        email: user.email,
        mobile: user.mobile,
        profile_pic_url: user.profilePic,
      };
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", authUser.id);
      if (error) {
        alert("Error updating profile: " + error.message);
      } else {
        alert("Profile updated successfully!");
      }
    } catch (err) {
      alert("Unexpected error: " + err.message);
    }
  };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      return alert("New passwords don't match");
    }
    if (!passwords.new) {
      return alert("New password cannot be empty");
    }

    const { error } = await supabase.auth.updateUser({
      password: passwords.new,
    });

    if (error) {
      alert(`Error changing password: ${error.message}`);
    } else {
      alert("Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" }); // Clear fields
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <InvestorNavbar investorName={investorName} isProfileMenuOpen={isProfileMenuOpen} setProfileMenuOpen={setProfileMenuOpen} hideProfileMenu={true} />
         <div
          className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${farmingBg2})` }}
        ></div>
        <div className="absolute inset-0 bg-green-950/60" />
        <div className="text-white text-2xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <InvestorNavbar investorName={investorName} isProfileMenuOpen={isProfileMenuOpen} setProfileMenuOpen={setProfileMenuOpen} hideProfileMenu={true} hideSidebarToggle={true} />
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${farmingBg2})` }}
      ></div>
      <div className="absolute inset-0 bg-green-950/60" />
      <div className="relative flex items-center justify-center min-h-screen p-4 pt-24">
        <div className="w-full max-w-md bg-white/20 backdrop-blur-3xl rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center">
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-green-400 cursor-pointer"
              onClick={() => fileRef.current.click()}
            >
              <img
                src={preview || "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileRef}
                onChange={handleUpload}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Upload size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full mt-6">
            {[
              { key: "profile", label: "Profile", icon: User },
              { key: "security", label: "Security", icon: Lock },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-300 ${
                  activeTab === key
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4 mt-6">
            {activeTab === "profile" && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={user.name}
                  onChange={handleInput}
                  className="w-full bg-white/70 text-gray-800 placeholder-gray-500 px-4 py-3 rounded-lg border-2 border-transparent focus:border-green-500 focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={handleInput}
                  className="w-full bg-white/70 text-gray-800 placeholder-gray-500 px-4 py-3 rounded-lg border-2 border-transparent focus:border-green-500 focus:outline-none"
                />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="+91 9876543210"
                  value={user.mobile}
                  onChange={handleInput}
                  className="w-full bg-white/70 text-gray-800 placeholder-gray-500 px-4 py-3 rounded-lg border-2 border-transparent focus:border-green-500 focus:outline-none"
                />
                <button
                  onClick={saveProfile}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-medium shadow-md"
                >
                  Save Profile
                </button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <input
                  type="password"
                  name="current"
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full bg-white/70 text-gray-800 placeholder-gray-500 px-4 py-3 rounded-lg border-2 border-transparent focus:border-green-500 focus:outline-none"
                />
                <input
                  type="password"
                  name="new"
                  placeholder="New Password"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="w-full bg-white/70 text-gray-800 placeholder-gray-500 px-4 py-3 rounded-lg border-2 border-transparent focus:border-green-500 focus:outline-none"
                />
                <input
                  type="password"
                  name="confirm"
                  placeholder="Confirm Password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="w-full bg-white/70 text-gray-800 placeholder-gray-500 px-4 py-3 rounded-lg border-2 border-transparent focus:border-green-500 focus:outline-none"
                />
                <button
                  onClick={changePassword}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-medium shadow-md"
                >
                  Change Password
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-6 pt-6">
            <a href="#" className="text-gray-300 hover:text-white transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              <Instagram size={20} />
            </a>
          </div>

          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="w-full bg-black/60 hover:bg-black/80 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}