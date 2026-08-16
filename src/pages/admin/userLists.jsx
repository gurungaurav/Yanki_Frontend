import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/user.api";
import { MdPerson, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function UserListsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="">
        <div className="flex justify-center items-center h-64 md:h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-600">
              Loading users...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-start mb-4 md:mb-6 ">
        User Management
      </h1>

      <div className="text-sm md:text-base text-gray-600 text-start  ">
        Registered users in the system
      </div>
      {users?.length > 0 && (
        <div className="my-4 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdPerson className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Total Registered Users
              </span>
            </div>
            <span className="text-lg font-bold text-blue-900">
              {users.length}
            </span>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {users?.length === 0 ? (
          <div className="text-center py-8">
            <MdPerson className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-600">
              No users found
            </p>
            <p className="text-sm text-gray-500 mt-2">
              No users have registered yet.
            </p>
          </div>
        ) : (
          users?.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MdPerson className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MdEmail className="h-4 w-4 text-gray-500" />
                  <span className="break-all">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MdPhone className="h-4 w-4 text-gray-500" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MdLocationOn className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{user.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MdPerson className="h-4 w-4" />
                  Name
                </div>
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MdEmail className="h-4 w-4" />
                  Email
                </div>
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MdPhone className="h-4 w-4" />
                  Phone
                </div>
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MdLocationOn className="h-4 w-4" />
                  Address
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12">
                  <MdPerson className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-600">
                    No users found
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    No users have registered yet.
                  </p>
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <MdPerson className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                      @{user.username}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={user.email}>
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phoneNumber || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm text-gray-900 max-w-xs">
                    {user.address ? (
                      <div className="line-clamp-2" title={user.address}>
                        {user.address}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
    </div>
  );
}
