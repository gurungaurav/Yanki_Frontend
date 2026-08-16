import { useEffect, useState } from "react";
import { getContactUsMail } from "../../api/message.api";
import { MdEmail, MdCalendarToday, MdPerson } from "react-icons/md";

export default function MessageListsPage() {
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getContactUsMail();
      setFilteredMessages(data.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="">
        <div className="flex justify-center items-center h-64 md:h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-600">
              Loading messages...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-2xl md:text-3xl font-semibold text-start mb-4 md:mb-6 ">
        Contact Messages
      </h1>

      <div className="text-sm md:text-base text-gray-600 text-start ">
        Messages received from the contact form
      </div>
      {filteredMessages?.length > 0 && (
        <div className="my-4 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdEmail className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Total Messages
              </span>
            </div>
            <span className="text-lg font-bold text-blue-900">
              {filteredMessages.length}
            </span>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {filteredMessages?.length === 0 ? (
          <div className="text-center py-8">
            <MdEmail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-600">
              No messages found
            </p>
            <p className="text-sm text-gray-500 mt-2">
              No contact messages have been received yet.
            </p>
          </div>
        ) : (
          filteredMessages?.map((message) => (
            <div
              key={message._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MdPerson className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-gray-900">
                    {message.name}
                  </h3>
                  {message.email && (
                    <a
                      href={`mailto:${message.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {message.email}
                    </a>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MdCalendarToday className="h-4 w-4" />
                    {new Date(message.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MdEmail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Message:
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {message.message}
                </p>
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
                <div className="flex items-center gap-2">
                  <MdEmail className="h-4 w-4" />
                  Email
                </div>
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MdCalendarToday className="h-4 w-4" />
                  Date
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMessages?.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12">
                  <MdEmail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-600">
                    No messages found
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    No contact messages have been received yet.
                  </p>
                </td>
              </tr>
            ) : (
              filteredMessages?.map((message) => (
                <tr
                  key={message._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <MdPerson className="h-4 w-4 text-blue-600" />
                      </div>
                      {message.name}
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm">
                    {message.email ? (
                      <a
                        href={`mailto:${message.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {message.email}
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm text-gray-900 max-w-md">
                    <div className="line-clamp-3 leading-relaxed">
                      {message.message}
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <MdCalendarToday className="h-4 w-4 text-gray-400" />
                      {new Date(message.timestamp).toLocaleDateString()}
                    </div>
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
