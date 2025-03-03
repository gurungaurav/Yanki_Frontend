import { cn } from "../lib/utils";

const Button = ({ buttonName, handleOnClick, className, type, isDisabled }) => {
  console.log(isDisabled, "isDisabled");

  return (
    <button
      onClick={handleOnClick}
      type={type}
      disabled={isDisabled}
      className={cn(
        `py-2 px-4 text-sm rounded-md bg-gray-900 text-white font-semibold  duration-300 ${
          isDisabled
            ? " opacity-50 cursor-not-allowed"
            : "hover:opacity-90 cursor-pointer"
        }`,
        className
      )}
    >
      {buttonName}
    </button>
  );
};

export default Button;
