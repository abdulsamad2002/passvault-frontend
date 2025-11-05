import React, { useState } from "react";
import { IoShieldOutline } from "react-icons/io5";
import { RiGithubLine } from "react-icons/ri";
import { FaLinkedinIn } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#121212] text-[#E0E0E0]">
      <div className="flex items-center md:justify-around justify-between px-6 py-4">
        <div className="font-bold text-3xl flex items-center gap-3">
          <NavLink to="/">
            {" "}
            <IoShieldOutline />{" "}
          </NavLink>
          PassVault
        </div>

        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
        <ul className="hidden md:flex items-center gap-10">
          <li className="hover:text-white font-bold  transition-all duration-100">
            <NavLink
              to="/"
              className={(e) => {
                return e.isActive ? "text-white font-bold" : "";
              }}
            >
              Home
            </NavLink>
          </li>
          <li className="hover:text-white font-bold transition-all duration-100">
            <NavLink
              to="/vault"
              className={(e) => {
                return e.isActive ? "text-white font-bold" : "";
              }}
            >
              Vault
            </NavLink>
          </li>
          <li className="hover:text-white font-bold transition-all duration-100">
            <NavLink
              to="/about"
              className={(e) => {
                return e.isActive ? "text-white   font-bold" : "";
              }}
            >
              About
            </NavLink>
          </li>
          <li className="hover:text-white font-bold transition-all duration-100">
            <a href="">
              <RiGithubLine size={24} />
            </a>
          </li>
          <li className="hover:text-white font-bold transition-all duration-100">
            <a href="">
              <FaLinkedinIn size={24} />
            </a>
          </li>
        </ul>
      </div>
      {menuOpen && (
        <ul className="flex flex-col gap-4 px-6 pb-4 md:hidden">
          <li NavclassName="hover:text-white hover:font-bold">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li className="hover:text-white hover:font-bold">
            <NavLink to="/vault" onClick={() => setMenuOpen(false)}>
              Vault
            </NavLink>
          </li>
          <li className="hover:text-white hover:font-bold">
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
          </li>
          <li>
            <a href="" className="hover:text-white flex items-center gap-2">
              <RiGithubLine size={24} />
              GitHub
            </a>
          </li>
          <li>
            <a href="" className="hover:text-white flex items-center gap-2">
              <FaLinkedinIn size={24} />
              LinkedIn
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
