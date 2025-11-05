import { useState, useEffect } from "react";
import Logo from "./Logo";
import { FaRegSave } from "react-icons/fa";
import List from "./List";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import { MdNoEncryption } from "react-icons/md";

function Manager() {
  const [visible, setVisible] = useState(false);
  const [records, setrecords] = useState([]);
  const [master, setmaster] = useState();

  async function getDocs() {
    let data = await fetch("https://passvault-backend-zeta.vercel.app/");
    let newData = await data.json();
    setrecords(newData);
  }

  useEffect(() => {
    getDocs();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  function toBase64(value) {
    const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);

    return btoa(String.fromCharCode(...bytes));
  }
  function fromBase64(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function base64ToArrayBuffer(b64) {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }
  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++)
      binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  // Decrypt function
  async function decryptPassword(
    masterPassword,
    saltB64,
    ivB64,
    ciphertextB64,
    { iterations = 200000, hash = "SHA-256", keyLength = 256 } = {}
  ) {
    try {
      // 1) Prepare inputs
      const salt = new Uint8Array(base64ToArrayBuffer(saltB64));
      const iv = new Uint8Array(base64ToArrayBuffer(ivB64));
      const ciphertext = base64ToArrayBuffer(ciphertextB64);

      // 2) Import master password as PBKDF2 key material
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(masterPassword),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
      );

      // 3) Derive an AES-GCM key using same params used in encryption
      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations,
          hash,
        },
        keyMaterial,
        { name: "AES-GCM", length: keyLength },
        false, // not extractable
        ["decrypt"] // only allow decrypt
      );

      // 4) Decrypt
      const plainBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        ciphertext
      );

      // 5) Convert to string and return
      return new TextDecoder().decode(plainBuffer);
    } catch (err) {
      // Typical failure modes:
      // - wrong master password (derived key wrong) => authentication fails
      // - ciphertext/iv corrupted or tampered with => authentication fails
      // crypto.subtle.decrypt throws a DOMException on auth failure
      toast.info("Decryption failed! Wrong key", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(err);
      throw new Error(
        "Decryption failed. Possible wrong password or corrupted data."
      );
    }
  }

  async function decrypter() {
    const masterPassword = master;
    for (const item of records) {
      const saltB64 = item.salt;
      const ivB64 = item.iv;
      const ciphertextB64 = item.ciphertext;

      try {
        const plaintext = await decryptPassword(
          masterPassword,
          saltB64,
          ivB64,
          ciphertextB64
        );
        item.password = plaintext;
        // console.log("Decrypted password:", plaintext);
        let newArr = [...records];
        setrecords(newArr);
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  async function encrypter(data) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(data.masterpassword),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 200000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(data.password)
    );
    let newArr = [
      ...records,
      {
        ...data,
        ciphertext: toBase64(encrypted),
        salt: toBase64(salt),
        iv: toBase64(iv),
      },
    ];
    newArr.forEach((obj) => {
      delete obj.password;
      delete obj.masterpassword;
    });
    setrecords(newArr);
  }

  function submitter(data) {
    let newData = { id: uuidv4(), ...data };
    encrypter(newData);
    setmaster("");
    reset();
  }

  function handleDelete(id) {
    toast.info("Deleted successfully!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    let index = records.findIndex((item) => {
      return item.id === id;
    });
    let newTodoList = [...records];
    newTodoList.splice(index, 1);
    setrecords(newTodoList);
  }

  async function setDocs(sanitized) {
    let res = await fetch("https://passvault-backend-zeta.vercel.app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitized),
    });
  }

  useEffect(() => {
    const safeRecords = Array.isArray(records) ? records : [];
    const sanitized = safeRecords.map((obj) => {
      const { password, masterpassword, ...rest } = obj || {};
      return rest;
    });

    const timeoutId = setTimeout(() => {
      setDocs(sanitized);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [records]);

  // useEffect(() => {
  //   const safeRecords = Array.isArray(records) ? records : [];
  //   const sanitized = safeRecords.map((obj) => {
  //     const { password, masterpassword, ...rest } = obj || {};
  //     return rest;
  //   });

  //   // console.log(sanitized); // original (may contain ephemeral plaintext if you still mutate elsewhere)
  //   // localStorage.setItem("records", JSON.stringify(sanitized));
  //   setDocs(sanitized);
  // }, [records]);

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
      <Logo />
      <form action="" onSubmit={handleSubmit(submitter)}>
        <div className="w-full flex justify-center items-center flex-col gap-5 my-10 h-full px-4">
          <input
            type="text"
            name="website"
            placeholder="Website"
            className="bg-white border-2 border-black w-full md:w-1/2 p-2 rounded-2xl px-5"
            {...register("website", { required: true })}
          />

          <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full md:w-1/2">
            <input
              name="username"
              type="text"
              placeholder="Username"
              className="bg-white border-2 border-black w-full md:w-1/2 p-2 rounded-2xl px-5"
              {...register("username", { required: true })}
            />

            <div className="flex w-full md:w-1/2 items-center gap-2">
              <input
                type={visible ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="bg-white border-2 border-black w-full p-2 rounded-2xl px-5"
                {...register("password", { required: true })}
              />
              <button onClick={() => setVisible((v) => !v)} type="button">
                {visible ? (
                  <div className="text-white">
                    <FaEye size={24} />
                  </div>
                ) : (
                  <div className="text-white">
                    <AiFillEyeInvisible size={24} />
                  </div>
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-around items-center w-full md:w-1/2 gap-2">
            <input
              type={visible ? "text" : "password"}
              name="key"
              placeholder="Master Password"
              className="bg-white border-2 border-black w-full p-2 rounded-2xl px-5"
              {...register("masterpassword", { required: true })}
              onChange={(e) => setmaster(e.target.value)}
            />
            <button onClick={() => setVisible((v) => !v)} type="button">
              {visible ? (
                <div className="text-white">
                  <FaEye size={24} />
                </div>
              ) : (
                <div className="text-white">
                  <AiFillEyeInvisible size={24} />
                </div>
              )}
            </button>
          </div>
          <div className="flex justify-around items-center md:w-1/3">
            <button
              type="submit"
              className="border-2 bg-white border-black px-6 py-2 rounded-2xl flex gap-3 items-center hover:bg-[#121212] hover:text-white transition-all duration-500 hover:border-white"
            >
              Save <FaRegSave size={22} />
            </button>
            <button
              type="button"
              className="border-2 bg-white border-black px-6 py-2 rounded-2xl flex gap-3 items-center hover:bg-[#121212] hover:text-white transition-all duration-500 hover:border-white"
              onClick={decrypter}
            >
              Decrypt <MdNoEncryption size={22} />
            </button>
          </div>
        </div>
      </form>

      <div className="w-full md:w-full bg-[#121212] text-[#E0E0E0] mx-auto rounded-xl mb-20 overflow-x-auto">
        <div className="min-w-[650px]">
          <div className="flex text-center">
            <div className="w-1/6 p-2 border border-[#444444] rounded-tl-xl font-semibold">
              Site
            </div>
            <div className="w-1/6 p-2 border border-[#444444] font-semibold">
              Username
            </div>
            <div className="w-1/6 p-2 border border-[#444444] font-semibold">
              Hash
            </div>
            <div className="w-2/6 p-2 border border-[#444444] font-semibold">
              Password
            </div>
            <div className="w-1/6 p-2 border border-[#444444] rounded-tr-xl font-semibold">
              Actions
            </div>
          </div>

          {records.length === 0 && (
            <div className="h-40 w-full flex items-center justify-center opacity-20 font-bold text-3xl md:text-5xl">
              <h2>Vault Empty</h2>
            </div>
          )}

          {records.map((dataObj) => (
            <List
              key={dataObj.id}
              ciphertext={dataObj.ciphertext}
              website={dataObj.website}
              username={dataObj.username}
              password={dataObj.password}
              records={records}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Manager;
