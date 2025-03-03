import { useEffect, useState } from "react";
import { getContactUsMail } from "../../api/message.api";

export default function MessageListsPage() {
  const [filteredMessages, setFilteredMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const data = await getContactUsMail();
      setFilteredMessages(data.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Message Details</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Message
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages?.map((message) => (
              <tr key={message._id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {message.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {message.message}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(message.timestamp).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
