export function Button({ className, ...props }) {
    return (
      <button
        className={`transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
        {...props}
      />
    );
  }