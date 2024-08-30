import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      className="bg-red-500 hover:bg-red-700 text-white py-2 px-6 rounded-full transition-colors duration-300 whitespace-nowrap text-base"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
