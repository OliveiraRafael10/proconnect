export function Label({ className, ...props }) {
    return <label className={`block mb-1 font-medium text-gray-700 ${className}`} {...props} />;
}