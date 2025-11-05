import React from "react";
import { FaRegCopyright } from "react-icons/fa6";


const Footer = () => {
  return (
    <>
      <div className="w-full h-10 fixed bottom-0 bg-[#121212] text-[#E0E0E0] flex justify-center flex-row items-center font-bold gap-4">
         <FaRegCopyright /> Abdul Samad
      </div>
    </>
  );
};

export default Footer;
