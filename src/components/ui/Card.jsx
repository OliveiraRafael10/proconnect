export function Card({ children, className }) {

  return <div id="card" className={`rounded-lg shadow-md ${className}`}>{children}</div>;

}