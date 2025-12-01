export function Input({ className, ...props }) {
    return (
      <input
        className={`text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-200 ${className}`}
        {...props}
      />
    );
  }