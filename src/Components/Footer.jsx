import React from "react";
import { FaRegCopyright } from "react-icons/fa6";
import { IoBugSharp } from "react-icons/io5";



const Footer = () => {
  return (
    <>
      <div className="w-full h-10 fixed bottom-0 bg-[#121212] text-[#E0E0E0] flex justify-center flex-row items-center font-bold gap-4">
         <FaRegCopyright /> Abdul Samad  <a href="mailto:blackhawkalpha009@gmail.com" className="text-[12px] flex justify-center items-center gap-2">Report <IoBugSharp /></a>
      </div>
    </>
  );
};

export default Footer;
