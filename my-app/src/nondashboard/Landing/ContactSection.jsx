import React, { useState } from "react";
import ReactDOM from "react-dom";
import AnimationBackgroundElement from "./AnimationBackgroundElement";

const WEB3FORMS_ACCESS_KEY = "5277255e-210e-4367-b017-463144a481d8";

const ContactModal = ({ show, onClose, submitted, handleWeb3FormsSubmit }) => {
  if (!show) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative z-[10000]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-green-600 hover:text-green-700 text-2xl bg-transparent border p-1 flex items-center justify-center"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-4 text-green-600">Contact Us</h3>
        {submitted ? (
          <div className="text-green-600 font-semibold text-lg">Thank you for contacting us!</div>
        ) : (
          <form onSubmit={handleWeb3FormsSubmit} className="flex flex-col gap-4">
            <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              rows={4}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all font-semibold"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

const ContactSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Success handler for Web3Forms
  const handleWeb3FormsSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        alert("Failed to send message. Please try again later.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <section id="contact" className="py-20 px-6 bg-white relative">
      <AnimationBackgroundElement />
      <div className="max-w-4xl mx-auto text-center z-10 relative">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Platform Integration</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join AgriConnect to access our comprehensive ecosystem. Seamlessly integrate with our 
          farmer network, investment opportunities, and direct marketplace and secure smart contracts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg font-semibold"
            onClick={() => { setShowForm(true); setSubmitted(false); }}
          >
            Contact Us
          </button>
        </div>
        <ContactModal
          show={showForm}
          onClose={() => { setShowForm(false); setSubmitted(false); }}
          submitted={submitted}
          handleWeb3FormsSubmit={handleWeb3FormsSubmit}
        />
      </div>
    </section>
  );
};

export default ContactSection;