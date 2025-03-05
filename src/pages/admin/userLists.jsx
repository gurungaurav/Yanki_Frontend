import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/user.api";

export default function UserListsPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">User Details</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                First Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Last Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Username
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Phone Number
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Address
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <p className="font-bold text-2xl text-black ">
                    No users found
                  </p>
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr key={user._id} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {user.firstName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.lastName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.username}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.phoneNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.address}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
