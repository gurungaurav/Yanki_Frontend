export const Modal = ({
  show,
  onClose,
  onConfirm,
  message,
  children,
  disableConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h3 className="text-lg font-semibold">{message}</h3>
        {children}
        <div className="mt-4 flex justify-end">
          <button
            className={`bg-red-500 text-white py-2 px-4 rounded mr-2 cursor-pointer ${
              disableConfirm ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onConfirm}
            disabled={disableConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
