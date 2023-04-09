import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext/AuthContext";
import logoHome from "../../Assets/img/logo-home.svg";
import accountIcon from "../../Assets/img/account.svg";


export default function Header() {
  const { logout, loggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <header className="w-full fixed top-0 left-0 z-40 shadow-sm bg-white">
        <div className="container mx-auto py-4 flex items-center justify-between px-2 sm:px-0">
          <Link to={loggedIn ? "/dashboard" : "/"}>
                <img src={logoHome} alt="Logo for FinTrack" />
          </Link>


          <div className="flex flex-row items-center justify-between space-x-10">
            {
              !loggedIn ? (
                <>
                  <Link to="/login"
                      className="text-lg font-medium text-black flex">
                    <span>Login</span>
                  </Link>
                  <Link to="/signup"
                      className="rounded-md items-center text-lg font-medium px-8 py-3.5 bg-primary
                        text-white drop-shadow-lg 
                        active:drop-shadow-none hover:bg-primaryLight flex">
                    <span>Sign up</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/account" className="w-12 h-12 flex items-center justify-center p-2 rounded-md group hover:bg-zinc-100
                       outline-zinc-200 focus:bg-zinc-100">
                    <img src={accountIcon} className="w-8 h-8 block transition-transform group-active:scale-95" alt="Profile icon" />
                  </Link>
                  <button type="button" onClick={handleLogout}
                        className="rounded-md items-center text-lg font-medium px-8 py-3.5 bg-primary
                          text-white drop-shadow-lg 
                          active:drop-shadow-none hover:bg-primaryLight flex">
                      <span>Logout</span>
                  </button>
                </>
              )
            }
          </div>
        </div>
    </header>
  )
}
