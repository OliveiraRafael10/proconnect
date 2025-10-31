export function Label({ className, ...props }) {
    return <label className={`block ${className}`} {...props} />;
  }