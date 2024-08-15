import { Link } from "react-router-dom";

const Alert = ({ title, children }) => {
  return (
    <div className="p-4 text-gray-800 dark:text-gray-200">
      <h1 className=" mb-4 text-2xl font-bold">{title}</h1>
      <div className="mb-4">{children}</div>
      <Link to="/" className="hover:underline">
        ← Back to home
      </Link>
    </div>
  );
};

export default Alert;
