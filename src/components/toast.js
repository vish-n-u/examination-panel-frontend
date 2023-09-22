import React, { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close the toast after 3 seconds (adjust as needed)

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const toastClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 w-60 rounded-md text-white ${toastClasses} shadow-lg`}
    >
      <p>{message}</p>
    </div>
  );
};




export default Toast;


