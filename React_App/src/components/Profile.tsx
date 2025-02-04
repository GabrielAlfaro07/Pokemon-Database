import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../ThemeContext";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { isDarkTheme } = useTheme();

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="flex flex-col items-center p-4">
        <img
          src={user?.picture}
          alt={user?.name}
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-xl font-bold">{user?.name}</h2>
        <p
          className={`${
            isDarkTheme ? "text-white" : "text-gray-700"
          }text-gray-400`}
        >
          {user?.email}
        </p>
      </div>
    )
  );
};

export default Profile;
