import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

const DeleteAccountForm = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const resetChat = useChatStore((state) => state.reset);

  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setLoading(true);
      await axiosInstance.delete("/auth/delete-account");
      logout(); // Clear user auth state
      resetChat(); // Clear chat state
      toast.success("Account deleted successfully.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border border-red-300 bg-red-50 shadow-sm max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold text-red-700 mb-3">Danger Zone</h2>
      <p className="text-sm text-red-600 mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <button
        onClick={handleDeleteAccount}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete My Account"}
      </button>
    </div>
  );
};

export default DeleteAccountForm;
