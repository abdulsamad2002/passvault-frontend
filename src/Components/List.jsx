import React from "react";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye } from "react-icons/fa";




import { ToastContainer, toast } from "react-toastify";

function copyText(text) {
  console.log(text);
  navigator.clipboard.writeText(text);
  toast.info("Copied to clipboard", {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}

const List = (props) => {
  const [passEye, setpassEye] = useState(false);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="w-full cursor-pointer flex flex-row bg-[#E0E0E0] hover:bg-[#ffffff] text-[#121212] transition-all duration-500">
        <div
          onClick={() => copyText(props.website)}
          className="overflow-hidden cursor-pointer flex justify-center items-center font-semibold h-full w-1/6 p-1 border border-[#444444]"
        >
          {props.website}
        </div>
        <div
          onClick={() => copyText(props.username)}
          className="overflow-hidden cursor-pointer flex justify-center items-center font-semibold h-full w-1/6 p-1 border border-[#444444]"
        >
          {props.username}
        </div>
        <div
          onClick={() => copyText(props.ciphertext)}
          className="overflow-hidden cursor-pointer flex justify-center items-center font-semibold h-full w-1/6 p-1 border border-[#444444]"
        >
          {props.ciphertext}
        </div>
        <div className="overflow-hidden cursor-pointer flex justify-center items-center font-semibold h-full w-2/6 p-1 border border-[#444444] px-5">
          <input
            type={passEye ? "text" : "password"}
            value={props.password  || ''
            }
            readOnly
            className="w-full cursor-pointer"
            onClick={() => copyText(props.password)}
          />
          <button onClick={() => setpassEye((v) => !v)}>
            {passEye ? (
              <div className="text-black">
                <FaEye size={24} />
              </div>
            ) : (
              <div className="text-black">
                <AiFillEyeInvisible size={24} />
              </div>
            )}
          </button>
        </div>

        <div className=" flex justify-center items-center font-semibold h-full w-1/6 p-1 border border-[#444444]  gap-3">
          Delete{" "}
          <MdDelete
            className="h-6 w-6 hover:rounded hover:bg-[#444444] hover:text-white transition-all duration-500"
            size={24}
            onClick={() => {
              props.handleDelete(props.id);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default List;
