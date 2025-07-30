// import { X } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";

// const ChatHeader = () => {
//   const { selectedUser, setSelectedUser } = useChatStore();
//   const { onlineUsers } = useAuthStore();

//   return (
//     <div className="p-2.5 border-b border-base-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/* Avatar */}
//           <div className="avatar">
//             <div className="size-10 rounded-full relative">
//               <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
//             </div>
//           </div>

//           {/* User info */}
//           <div>
//             <h3 className="font-medium">{selectedUser.fullName}</h3>
//             <p className="text-sm text-base-content/70">
//               {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
//             </p>
//           </div>
//         </div>

//         {/* Close button */}
//         <button onClick={() => setSelectedUser(null)}>
//           <X />
//         </button>
//       </div>
//     </div>
//   );
// };
// export default ChatHeader;
import { X, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirmed) return;

    try {
      await axiosInstance.delete("/auth/delete-account");
      logout(); // clear auth state
      useChatStore.getState().reset(); // clear chat state
      navigate("/login");
      toast.success("Account deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3">
          {/* Delete Account */}
          <button
            onClick={handleDeleteAccount}
            className="text-red-500 hover:text-red-700"
            title="Delete Account"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* Close Chat */}
          <button onClick={() => setSelectedUser(null)} title="Close Chat">
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
