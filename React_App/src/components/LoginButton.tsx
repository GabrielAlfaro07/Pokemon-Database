import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    localStorage.setItem("lastPage", window.location.pathname);
    loginWithRedirect();
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition-colors duration-300 whitespace-nowrap text-base"
    >
      Log In
    </button>
  );
};

export default LoginButton;
