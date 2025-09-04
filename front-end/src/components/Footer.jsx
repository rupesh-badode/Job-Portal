// JobPortalFooter.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">JobPortal</h3>
          <p className="text-gray-400 text-sm">
            Connecting job seekers with top employers. Find your dream job or the perfect candidate.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/" className="hover:text-indigo-500">Home</Link></li>
            <li><Link to="/jobs" className="hover:text-indigo-500">Jobs</Link></li>
            <li><Link to="/about" className="hover:text-indigo-500">About</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-500">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/privacy" className="hover:text-indigo-500">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-indigo-500">Terms of Service</Link></li>
            <li><Link to="/faq" className="hover:text-indigo-500">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact</h3>
          <p className="text-gray-400 text-sm">123 JobStreet, City, Country</p>
          <p className="text-gray-400 text-sm">Email: support@jobportal.com</p>
          <p className="text-gray-400 text-sm">Phone: +91 12345 67890</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 py-4 text-center text-gray-500 text-sm">
        &copy; 2025 JobPortal. All rights reserved.
      </div>
    </footer>
  );
}
