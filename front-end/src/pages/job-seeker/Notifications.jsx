// Notifications.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/jobs/applications");
        setNotifications(res.data); // ✅ your API returns an array
        console.log("Fetched notifications:", res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  // 🔹 Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <>
      {/* Button to open modal */}
      <button
        onClick={() =>  {console.log("open button clicked"); setOpen(true)}}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        type="button"
      >
        Show Notifications ({notifications.length})
      </button>

      {/* AnimatePresence wraps modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[9999]" // 🔥 highest priority
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background overlay */}
            <div
              className="absolute inset-0 bg-black bg-opacity-40"
              onClick={() => setOpen(false)}
            ></div>

            {/* Modal box */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-6 z-10"
            >
              <h2 className="text-xl font-bold mb-4">Notifications</h2>

              {notifications.length > 0 ? (
                <ul className="space-y-3 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {notifications.map((n) => (
                      <motion.li
                        key={n._id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-between items-start p-3 rounded-xl border shadow-sm bg-blue-50 border-blue-300"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {n.applicantId?.name} applied for{" "}
                            <strong>{n.jobId?.title}</strong>
                          </p>
                          <p className="text-xs text-gray-600">
                            Status: {n.status}
                          </p>
                          <span className="text-xs text-gray-400">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => removeNotification(n._id)}
                          className="ml-3 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <p className="text-gray-500">No notifications yet.</p>
              )}

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
