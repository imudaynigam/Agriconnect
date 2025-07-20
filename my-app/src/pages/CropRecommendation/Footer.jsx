import { Leaf } from "lucide-react";
import React from "react";

const FooterSection = () => {
  /* ---------- shared link style + hover helpers ---------- */
  const linkStyle = {
    color: "#9CA3AF",          // gray-400
    fontSize: "0.875rem",      // text-sm
    textDecoration: "none",
    transition: "color 0.2s ease-in-out",
  };
  const toggleHover = (e, on) => {
    e.target.style.color = on ? "#FFFFFF" : "#9CA3AF";
  };

  return (
    <footer
      /* make the section break out of any centred wrapper */
      style={{
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        width: "100vw",

        backgroundColor: "#1F2937", // gray-800
        color: "#FFFFFF",
        padding: "3rem 1.5rem 1.5rem",
        marginTop: "auto",          // pushes footer to the bottom in flex layouts
      }}
    >
      {/* inner grid container */}
      <div
        style={{
          maxWidth: "1280px",      // ≈ Tailwind’s max-w-7xl
          margin: "0 auto",
          display: "grid",
          gap: "2.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {/* ------------ Column 1  LOGO + ABOUT ------------ */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <Leaf size={32} color="#34D399" />   {/* green-400 */}
            <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              AgriConnect
            </span>
          </div>

          <p style={{ color: "#9CA3AF", fontSize: "0.875rem", lineHeight: "1.5rem" }}>
            Full-stack AI-powered agri-tech platform bridging farmers, investors,
            and consumers through innovative technology and secure smart contracts.
          </p>
        </div>

        {/* ------------ Column 2  PLATFORM MODULES ------------ */}
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "1rem" }}>Platform Modules</h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {["Farmer Dashboard", "Investor Portal", "User Marketplace", "Admin Panel"].map((item) => (
              <li key={item} style={{ marginBottom: "0.5rem" }}>
                <a
                  href="#"
                  style={linkStyle}
                  onMouseOver={(e) => toggleHover(e, true)}
                  onMouseOut={(e) => toggleHover(e, false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ------------ Column 3  KEY FEATURES ------------ */}
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "1rem" }}>Key Features</h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {["Weather Analytics", "Smart Contracts", "AI Recommendations", "Market Trends"].map((item) => (
              <li key={item} style={{ marginBottom: "0.5rem" }}>
                <a
                  href="#"
                  style={linkStyle}
                  onMouseOver={(e) => toggleHover(e, true)}
                  onMouseOut={(e) => toggleHover(e, false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ------------ Column 4  SUPPORT ------------ */}
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "1rem" }}>Support</h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {["Help Center", "Contact", "Privacy", "Terms"].map((item) => (
              <li key={item} style={{ marginBottom: "0.5rem" }}>
                <a
                  href="#"
                  style={linkStyle}
                  onMouseOver={(e) => toggleHover(e, true)}
                  onMouseOut={(e) => toggleHover(e, false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ------------ Bottom line ------------ */}
      <div
        style={{
          borderTop: "1px solid #374151", // gray-700
          marginTop: "2.5rem",
          paddingTop: "1.5rem",
          textAlign: "center",
          color: "#6B7280",               // gray-500
          fontSize: "0.875rem",
        }}
      >
        © 2025 AgriConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterSection;