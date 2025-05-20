export function Button({ className, ...props }) {
    return (
      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${className}`}
        {...props}
      />
    );
  }