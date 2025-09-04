import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function JobseekerLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Find Your Dream Job Easily 🚀
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl mb-8 max-w-2xl"
        >
          Explore thousands of opportunities from top companies.  
          Apply with just one click and build your career.
        </motion.p>

        <div className="flex gap-4">
          <Link
            to="/jobs"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg text-center"
        >
          <h3 className="text-xl font-semibold mb-2">🔎 Easy Job Search</h3>
          <p className="text-gray-600">
            Filter jobs by role, location, and skills to find the best fit for you.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg text-center"
        >
          <h3 className="text-xl font-semibold mb-2">📄 Quick Apply</h3>
          <p className="text-gray-600">
            Save time with one-click applications and manage everything in your dashboard.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg text-center"
        >
          <h3 className="text-xl font-semibold mb-2">💼 Career Growth</h3>
          <p className="text-gray-600">
            Access resources, resume tips, and interview prep to boost your career.
          </p>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
        <p className="mb-6">Join thousands of jobseekers who found their career with us.</p>
      </section>
    </div>
  );
}
