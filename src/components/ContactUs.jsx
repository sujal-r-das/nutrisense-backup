// src/components/ContactUs.jsx
import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaHeadset, FaPaperPlane } from 'react-icons/fa'; 

// The path is now relative since the server hosts the frontend
const BACKEND_URL = ""; 

export default function ContactUs() {
  const [formData, setFormData] = useState({ fromEmail: '', subject: '', message: '' });
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // The official support email address for the backend to use
  const supportEmail = "nutrisenseai@gmail.com"; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');

    try {
      // FIX: Reverted to relative path for deployment/single-server mode
      const res = await fetch(`${BACKEND_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponseMessage(data.message);
      
      if (res.ok) {
        setFormData({ fromEmail: '', subject: '', message: '' }); // Clear form on success
      }
    } catch (error) {
      setResponseMessage("Connection error. Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg mx-auto border-t-4 border-green-500 dark:border-green-600">
      <h2 className="text-3xl font-extrabold mb-6 text-green-700 dark:text-green-400 text-center flex items-center justify-center space-x-2">
        <FaHeadset className="text-2xl" /> 
        <span>Contact & Support</span>
      </h2>
      
      {/* -------------------- Contact Details -------------------- */}
      <div className="space-y-4 mb-8">
        {/* Email Contact Detail */}
        <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <FaEnvelope className="text-xl text-green-600 dark:text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Support Email</p>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              <a href={`mailto:${supportEmail}`} className="underline hover:text-green-600 dark:hover:text-green-400 transition-colors">
                {supportEmail}
              </a>
            </p>
          </div>
        </div>

        {/* Mobile Support Group */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-4 mb-2">
            <FaPhone className="text-xl text-green-600 dark:text-green-500" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile Support Team</p>
          </div>
          <ul className="text-lg text-gray-900 dark:text-gray-100 list-disc list-inside ml-4 space-y-1 text-sm">
            <li><a href="tel:8830512705" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">8830512705</a></li>
            <li><a href="tel:9325643781" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">9325643781</a></li>
            <li><a href="tel:9067323191" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">9067323191</a></li>
          </ul>
        </div>
      </div>

      {/* -------------------- Direct Email Form -------------------- */}
      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200 flex items-center space-x-2 border-t pt-6 mt-6 border-gray-200 dark:border-gray-700">
        <FaPaperPlane className="text-green-600" />
        <span>Send Us a Message</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="fromEmail"
          placeholder="Your Email Address"
          value={formData.fromEmail}
          onChange={handleChange}
          required
          className="input w-full text-sm"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="input w-full text-sm"
        />
        <textarea
          name="message"
          placeholder="Your Message..."
          value={formData.message}
          onChange={handleChange}
          required
          rows="4"
          className="input w-full text-sm resize-none"
        ></textarea>
        
        <button
          type="submit"
          className="w-full btn-primary text-base flex items-center justify-center space-x-2"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <FaPaperPlane className="h-4 w-4" />
              <span>Send Email</span>
            </>
          )}
        </button>
      </form>
      
      {responseMessage && (
        <p className={`mt-4 text-center text-sm font-semibold ${responseMessage.includes('sent successfully') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {responseMessage}
        </p>
      )}

      <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm italic">
        We strive to respond to all inquiries within 24-48 hours.
      </p>
    </section>
  );
}