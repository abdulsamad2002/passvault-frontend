import {
  Shield,
  Lock,
  Key,
  Database,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Background from "./Background";
import { IoShieldOutline } from "react-icons/io5";

function About() {
  return (
    <div className="min-h-screen  text-[#E0E0E0]">
        <Background/>
      {/* <div className="w-full bg-gradient-to-r from-[#1a1a1a] to-[#121212] py-12 px-4 border-b border-[#444444]"> */}
        <div className="max-w-4xl mx-auto mt-10 p-5">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
            
            About PassVault
          </h1>
          <p className="text-xl text-[#B0B0B0]">
            A secure, client-side encrypted password manager that puts you in
            control
          </p>
        </div>
      {/* </div> */}

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* How It Works */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            How It Works
          </h2>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444]">
            <ol className="space-y-4 list-decimal list-inside text-lg">
              <li className="text-[#E0E0E0]">
                <strong className="text-white">Add Your Credentials:</strong>{" "}
                Enter the website, username, and password you want to store
              </li>
              <li className="text-[#E0E0E0]">
                <strong className="text-white">Set Master Password:</strong>{" "}
                Provide a master password that will encrypt your data
              </li>
              <li className="text-[#E0E0E0]">
                <strong className="text-white">Save Securely:</strong> Your
                password is encrypted instantly in your browser before storage
              </li>
              <li className="text-[#E0E0E0]">
                <strong className="text-white">Decrypt When Needed:</strong> Use
                your master password to decrypt and view your passwords
              </li>
            </ol>
          </div>
        </section>

        {/* Security Architecture */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            
            Security Architecture
          </h2>

          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444]">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle size={24} className="text-green-400" />
                Client-Side Encryption
              </h3>
              <p className="text-[#B0B0B0] leading-relaxed">
                All encryption happens in your browser before any data leaves
                your device. Your passwords are never transmitted or stored in
                plain text. Even we cannot read your passwords without your
                master password.
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444]">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle size={24} className="text-green-400" />
                Military-Grade Encryption
              </h3>
              <p className="text-[#B0B0B0] leading-relaxed">
                Your passwords are protected using industry-standard encryption
                algorithms with 256-bit keys. Each password gets a unique
                encryption key derived from your master password using 200,000
                iterations of key derivation, making brute-force attacks
                virtually impossible.
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444]">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle size={24} className="text-green-400" />
                Zero-Knowledge Architecture
              </h3>
              <p className="text-[#B0B0B0] leading-relaxed">
                Your master password never leaves your browser and is never
                stored anywhere. Only encrypted data is saved. This means no
                one, including server administrators, can access your passwords
                without your master password.
              </p>
            </div>
          </div>
        </section>

        {/* Encryption Flow */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            
            Encryption Process
          </h2>

          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444] overflow-x-auto">
            <div className="space-y-4 min-w-[600px]">
              <div className="flex items-center gap-4">
                <div className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold min-w-[180px] text-center">
                  Your Password
                </div>
                <div className="text-white">→</div>
                <div className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold min-w-[180px] text-center">
                  Master Password
                </div>
              </div>

              <div className="text-center text-white text-2xl">↓</div>

              <div className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold text-center">
                Key Derivation (200,000 iterations)
              </div>

              <div className="text-center text-white text-2xl">↓</div>

              <div className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold text-center">
                Unique Encryption Key Generated
              </div>

              <div className="text-center text-white text-2xl">↓</div>

              <div className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold text-center">
                Password Encrypted with Random Salt & IV
              </div>

              <div className="text-center text-white text-2xl">↓</div>

              <div className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold text-center">
                Encrypted Data Stored (Original Password Discarded)
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            Best Practices
          </h2>

          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444]">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span className="text-[#E0E0E0]">
                  <strong className="text-white">
                    Strong Master Password:
                  </strong>{" "}
                  Use a long, unique master password that you'll remember but
                  others can't guess
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span className="text-[#E0E0E0]">
                  <strong className="text-white">Never Share:</strong> Your
                  master password should never be shared with anyone or written
                  down in insecure locations
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span className="text-[#E0E0E0]">
                  <strong className="text-white">Unique Passwords:</strong> Use
                  different passwords for each website you store
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold mt-1">✗</span>
                <span className="text-[#E0E0E0]">
                  <strong className="text-white">Lost Master Password:</strong>{" "}
                  If you forget your master password, your data cannot be
                  recovered. There is no backdoor or reset option by design
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Key Features</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444]">
              <h3 className="text-lg font-semibold text-white mb-2">
                Secure Storage
              </h3>
              <p className="text-[#B0B0B0]">
                All passwords encrypted before storage with unique salts and
                initialization vectors
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444]">
              <h3 className="text-lg font-semibold text-white mb-2">
                Privacy First
              </h3>
              <p className="text-[#B0B0B0]">
                Zero-knowledge architecture ensures only you can access your
                data
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444]">
              <h3 className="text-lg font-semibold text-white mb-2">
                Instant Encryption
              </h3>
              <p className="text-[#B0B0B0]">
                Passwords are encrypted immediately in your browser, never
                transmitted in plain text
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#444444]">
              <h3 className="text-lg font-semibold text-white mb-2">
                Easy Management
              </h3>
              <p className="text-[#B0B0B0]">
                Simple interface to add, view, and delete your encrypted
                credentials
              </p>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className=" rounded-xl p-8 border border-[#444444] text-center">
          <IoShieldOutline size={48} className="mx-auto mb-4 text-[#E0E0E0]" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Your Security, Your Control
          </h3>
          <p className="text-[#B0B0B0] leading-relaxed max-w-2xl mx-auto">
            PassVault is designed with security and privacy as top priorities.
            By keeping encryption client-side and following a zero-knowledge
            architecture, we ensure that your sensitive data remains truly
            yours.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
