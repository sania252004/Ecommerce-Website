import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import the exact names from your adminSlice
import {
  fetchAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../redux/slices/adminSlice";
import { toast } from "sonner";

const AdminUsers = () => {
  const dispatch = useDispatch();
  // Ensure 'admin' matches the key in your store.js
  const { users, loading } = useSelector((state) => state.admin);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // ADD USER LOGIC
  const handleAddUser = async () => {
  try {
    // This ensures that even if something goes wrong in the UI, the data sent to the server is valid.
    const sanitizedData = {
      ...formUser,
      role: formUser.role.toLowerCase() 
    };

    await dispatch(addUser(sanitizedData)).unwrap();
    toast.success("User created successfully!");
    closeModals();
  } catch (err) {
    toast.error(err.message || "Server Error");
  }
};

  /* EDIT USER LOGIC */
  const openEdit = (user) => {
    setSelectedUser(user);
    setFormUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", 
    });
    setShowEditModal(true);
  };

  const handleEditUser = async () => {
    try {
      await dispatch(
        updateUser({ id: selectedUser._id, userData: formUser })
      ).unwrap();
      toast.success("User updated successfully");
      closeModals();
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    }
  };

  /* DELETE USER LOGIC */
  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(selectedUser._id)).unwrap();
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
    setFormUser({ name: "", email: "", password: "", role: "customer" });
  };

  if (loading && users.length === 0) return <div className="p-6">Loading Users...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">User Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-center">Role</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(user)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {showEditModal ? "Edit User" : "Add User"}
            </h3>
            <div className="space-y-4">
              <input
                placeholder="Name"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={formUser.name}
                onChange={(e) =>
                  setFormUser({ ...formUser, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={formUser.email}
                onChange={(e) =>
                  setFormUser({ ...formUser, email: e.target.value })
                }
              />
              {!showEditModal && (
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={formUser.password}
                  onChange={(e) =>
                    setFormUser({ ...formUser, password: e.target.value })
                  }
                />
              )}
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={formUser.role}
                onChange={(e) =>
                  setFormUser({ ...formUser, role: e.target.value })
                }
              > 
                <option value="customer">customer</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModals}
                className="border px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={showEditModal ? handleEditUser : handleAddUser}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm"
              >
                {showEditModal ? "Save Changes" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete User</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete {selectedUser?.name}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;