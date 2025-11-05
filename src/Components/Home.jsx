import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { IoShieldOutline } from "react-icons/io5";

const Home = () => {
  return (
    <>
      <div className="mt-20 w-full flex flex-col justify-center items-center transition-all duration-700 gap-10 px-4 text-center overflow-x-hidden">
        <div className="font-bold text-5xl flex justify-center items-center flex-col text-[#E0E0E0] my-4">
          PassVault
          <div className="text-[#a9a2a2] text-[15px]">
            Your own password manager
          </div>
        </div>

        <div className="text-white w-full max-w-xl text-sm md:text-base leading-relaxed">
          Pass Vault securely stores your credentials using strong encryption.
          Your master password never leaves your device, ensuring complete
          privacy and protection for your digital identity.
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10 w-full">
          <button className="border-2 bg-white border-black px-6 py-2 rounded-2xl flex gap-3 items-center hover:bg-[#121212] hover:text-white transition-all duration-300 hover:border-white w-full md:w-auto justify-center">
            <Link to="/vault" className="w-full">
              To Vault
            </Link>
          </button>

          <button className="border-2 bg-white border-black px-6 py-2 rounded-2xl flex gap-3 items-center hover:bg-[#121212] hover:text-white transition-all duration-300 hover:border-white w-full md:w-auto justify-center">
            <Link to="/about" className="w-full">
              Learn More
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
