export const Badge = ({ status }) => {
  let colorClass = "";

  switch (status) {
    case "delivered":
      colorClass = "bg-green-100 text-green-700 border-green-200 border";
      break;
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200 border";
      break;
    case "shipped":
      colorClass = "bg-blue-100 text-blue-700 border-blue-200 border";
      break;
    case "cancelled":
      colorClass = "bg-red-100 text-red-700 border-red-200 border";
      break;
    default:
      colorClass = "bg-gray-100 text-gray-700 border-gray-200 border";
  }

  return (
    <span
      className={`inline-block w-fit px-3 py-1 text-xs font-bold rounded-xl ${colorClass}`}
    >
      {status}
    </span>
  );
};
