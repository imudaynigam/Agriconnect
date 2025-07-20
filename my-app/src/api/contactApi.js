// contactApi.js

export async function submitContactForm(formData) {
  const response = await fetch("http://localhost:8000/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to send message.");
  }
  return response.json();
} 