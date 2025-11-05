import React, { useState } from 'react';
import { Lock, Shield, Database, Key, AlertTriangle, CheckCircle, Code, Workflow } from 'lucide-react';

export default function PasswordManagerDocs() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'architecture', label: 'Architecture', icon: Code },
    { id: 'workflow', label: 'Workflow', icon: Workflow },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'limitations', label: 'Limitations', icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PassVault
            </h1>
          </div>
          <p className="text-xl text-gray-300">Client-Side Encrypted Password Manager</p>
          <p className="text-sm text-gray-400 mt-2">Zero-Knowledge Architecture with AES-256-GCM Encryption</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'architecture' && <ArchitectureTab />}
          {activeTab === 'workflow' && <WorkflowTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'limitations' && <LimitationsTab />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">Project Overview</h2>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-gray-300 leading-relaxed">
          PassVault is a secure, client-side encrypted password manager that implements zero-knowledge architecture. 
          The application ensures that passwords are encrypted on the client before being transmitted to the server, 
          meaning the server never has access to plaintext credentials.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <FeatureCard 
            icon={Lock}
            title="Client-Side Encryption"
            description="All encryption happens in the browser using Web Crypto API with AES-256-GCM"
          />
          <FeatureCard 
            icon={Key}
            title="Master Password"
            description="Single master password derives encryption keys using PBKDF2 with 200,000 iterations"
          />
          <FeatureCard 
            icon={Database}
            title="MongoDB Storage"
            description="Encrypted data stored in MongoDB with salt, IV, and ciphertext"
          />
          <FeatureCard 
            icon={Shield}
            title="Zero-Knowledge"
            description="Server never sees plaintext passwords or master password"
          />
        </div>

        <h3 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">Technology Stack</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <TechStack 
            category="Frontend"
            technologies={['React', 'React Hook Form', 'React Toastify', 'React Icons', 'Tailwind CSS']}
          />
          <TechStack 
            category="Backend"
            technologies={['Node.js', 'Express', 'MongoDB', 'CORS', 'dotenv']}
          />
        </div>
      </div>
    </div>
  );
}

function ArchitectureTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">System Architecture</h2>
      
      <div className="bg-slate-900/50 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-purple-300 mb-4">Architecture Diagram</h3>
        <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm">
{`┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React Application (Manager.jsx)            │   │
│  │                                                      │   │
│  │  ┌────────────┐      ┌──────────────┐              │   │
│  │  │   Form     │──────▶│  Encryption  │              │   │
│  │  │   Input    │      │   Module     │              │   │
│  │  └────────────┘      └──────┬───────┘              │   │
│  │                             │                       │   │
│  │                    ┌────────▼────────┐             │   │
│  │                    │  Web Crypto API │             │   │
│  │                    │   AES-256-GCM   │             │   │
│  │                    │   PBKDF2        │             │   │
│  │                    └────────┬────────┘             │   │
│  │                             │                       │   │
│  │                    ┌────────▼────────┐             │   │
│  │                    │  State (records)│             │   │
│  │                    └────────┬────────┘             │   │
│  └─────────────────────────────┼──────────────────────┘   │
└────────────────────────────────┼──────────────────────────┘
                                 │
                    HTTP POST/GET│ (Encrypted Data)
                                 │
┌────────────────────────────────▼──────────────────────────┐
│                    SERVER (Node.js)                       │
│  ┌──────────────────────────────────────────────────┐     │
│  │              Express API Server                  │     │
│  │                                                  │     │
│  │  POST /  ──▶  Delete All & Insert Encrypted     │     │
│  │  GET  /  ──▶  Fetch All Encrypted Records       │     │
│  │                                                  │     │
│  └──────────────────┬───────────────────────────────┘     │
└─────────────────────┼─────────────────────────────────────┘
                      │
                      │ MongoDB Driver
                      │
┌─────────────────────▼─────────────────────────────────────┐
│                    MongoDB Database                       │
│  ┌──────────────────────────────────────────────────┐     │
│  │     passVault.documents Collection               │     │
│  │                                                  │     │
│  │  {                                               │     │
│  │    id: "uuid",                                   │     │
│  │    website: "example.com",                       │     │
│  │    username: "user@email.com",                   │     │
│  │    ciphertext: "base64...",                      │     │
│  │    salt: "base64...",                            │     │
│  │    iv: "base64..."                               │     │
│  │  }                                               │     │
│  └──────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘`}
        </pre>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <LayerCard 
          title="Client Layer"
          items={[
            'React UI Components',
            'Form Validation',
            'Encryption/Decryption Logic',
            'State Management',
            'Auto-save with Debouncing'
          ]}
          color="purple"
        />
        <LayerCard 
          title="API Layer"
          items={[
            'Express REST API',
            'CORS Middleware',
            'JSON Body Parser',
            'Error Handling',
            'MongoDB Connection'
          ]}
          color="blue"
        />
        <LayerCard 
          title="Data Layer"
          items={[
            'MongoDB Atlas/Local',
            'Documents Collection',
            'Delete & Insert Pattern',
            'No Plain Passwords',
            'UUID-based IDs'
          ]}
          color="green"
        />
      </div>
    </div>
  );
}

function WorkflowTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">Application Workflow</h2>

      <div className="space-y-8">
        <WorkflowSection 
          title="1. Saving a Password (Encryption Flow)"
          steps={[
            'User enters website, username, password, and master password',
            'Form validates all required fields',
            'On submit, encrypter() function is called',
            'Generate random 16-byte salt using crypto.getRandomValues()',
            'Import master password as PBKDF2 key material',
            'Derive AES-256-GCM key using PBKDF2 (200k iterations, SHA-256)',
            'Generate random 12-byte IV (Initialization Vector)',
            'Encrypt password using AES-GCM with derived key and IV',
            'Convert encrypted data, salt, and IV to Base64',
            'Add entry to state with ciphertext, salt, IV (no plaintext)',
            'Auto-save triggers after 500ms debounce',
            'POST sanitized data (without password/masterpassword) to server',
            'Server deletes all existing records and inserts new array',
            'Form resets and success toast appears'
          ]}
        />

        <div className="bg-slate-900/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Encryption Flow Diagram</h3>
          <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm">
{`User Input → Master Password
                ↓
         ┌──────────────┐
         │  PBKDF2 KDF  │  (200,000 iterations)
         │  + Salt      │  (16 random bytes)
         └──────┬───────┘
                ↓
         ┌──────────────┐
         │  AES-256-GCM │
         │  Encryption  │
         │  + IV        │  (12 random bytes)
         └──────┬───────┘
                ↓
    ┌───────────────────────┐
    │   Encrypted Output    │
    ├───────────────────────┤
    │ • Ciphertext (Base64) │
    │ • Salt (Base64)       │
    │ • IV (Base64)         │
    └───────────────────────┘
                ↓
          MongoDB Storage`}
          </pre>
        </div>

        <WorkflowSection 
          title="2. Decrypting Passwords"
          steps={[
            'User enters master password in form',
            'Clicks "Decrypt" button',
            'decrypter() iterates through all records',
            'For each record, extract salt, IV, and ciphertext (Base64)',
            'Convert Base64 strings back to ArrayBuffers',
            'Import master password as PBKDF2 key material',
            'Derive same AES-256-GCM key using stored salt',
            'Attempt decryption with derived key and stored IV',
            'If successful: plaintext password is set in state',
            'If failed: error toast appears (wrong password or corrupted data)',
            'UI updates to show decrypted passwords',
            'Plaintext remains in memory only (not saved to DB)'
          ]}
        />

        <WorkflowSection 
          title="3. Application Lifecycle"
          steps={[
            'On mount: useEffect fetches encrypted records from MongoDB',
            'Records loaded into state (only encrypted data)',
            'User adds/deletes entries → state updates',
            'useEffect watches state changes with 500ms debounce',
            'Sanitization removes any plaintext fields',
            'POST request sends encrypted data array to server',
            'Server performs deleteMany() then insertMany()',
            'Database stays synchronized with client state'
          ]}
        />
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Key Insight: Zero-Knowledge Architecture
        </h3>
        <p className="text-gray-300">
          The master password never leaves the browser. The server only stores encrypted ciphertext, salts, 
          and IVs. Even if the database is compromised, attackers cannot decrypt passwords without the master password. 
          The PBKDF2 key derivation with 200,000 iterations makes brute-force attacks computationally expensive.
        </p>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">Security Analysis</h2>

      <div className="space-y-6">
        <SecuritySection 
          title="Strengths"
          icon={CheckCircle}
          items={[
            {
              heading: 'AES-256-GCM Encryption',
              description: 'Industry-standard authenticated encryption providing both confidentiality and integrity'
            },
            {
              heading: 'PBKDF2 Key Derivation',
              description: '200,000 iterations with SHA-256 makes brute-force attacks time-consuming'
            },
            {
              heading: 'Random Salt & IV',
              description: 'Unique salt and IV for each entry prevents rainbow table attacks'
            },
            {
              heading: 'Client-Side Encryption',
              description: 'Server never sees plaintext passwords or master password'
            },
            {
              heading: 'No localStorage Usage',
              description: 'Plaintext passwords never persist in browser storage'
            },
            {
              heading: 'Auto-sanitization',
              description: 'Removes plaintext fields before sending to server'
            }
          ]}
          positive={true}
        />

        <SecuritySection 
          title="Critical Vulnerabilities"
          icon={AlertTriangle}
          items={[
            {
              heading: 'No HTTPS',
              description: 'Data transmitted over HTTP is vulnerable to man-in-the-middle attacks. Even encrypted data can be intercepted.'
            },
            {
              heading: 'No Authentication',
              description: 'API endpoints are publicly accessible. Anyone can read/modify the database.'
            },
            {
              heading: 'Wide-Open CORS',
              description: 'cors() allows any origin to access the API, enabling cross-site attacks'
            },
            {
              heading: 'No Rate Limiting',
              description: 'Vulnerable to brute-force attacks on the master password decryption'
            },
            {
              heading: 'Destructive Save Pattern',
              description: 'deleteMany({}) before insertMany() risks data loss on failed inserts'
            },
            {
              heading: 'No Master Password Verification',
              description: 'Wrong master password fails silently during decryption. No feedback before attempting.'
            },
            {
              heading: 'No Account System',
              description: 'Single shared database. No user isolation or multi-user support.'
            },
            {
              heading: 'XSS Vulnerability',
              description: 'No input sanitization on website/username fields when rendering in table'
            }
          ]}
          positive={false}
        />

        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl p-6 border border-red-500/30">
          <h3 className="text-xl font-semibold text-red-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Recommendation
          </h3>
          <p className="text-gray-300 mb-3">
            This application is NOT production-ready. Before deploying:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Implement HTTPS/TLS for all communications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Add user authentication (JWT, OAuth, or session-based)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Restrict CORS to specific trusted origins</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Implement rate limiting on API endpoints</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Use upsert pattern instead of delete-all-then-insert</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Add input validation and sanitization</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LimitationsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">Current Limitations</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <LimitationCard 
          title="Functional Limitations"
          items={[
            'No password update functionality',
            'No password recovery mechanism',
            'No password strength indicator',
            'No search/filter capability',
            'No export/import functionality',
            'No password history',
            'No multi-device sync',
            'No sharing capabilities'
          ]}
        />

        <LimitationCard 
          title="Technical Limitations"
          items={[
            'Single shared database (no multi-tenancy)',
            'No backup/restore mechanism',
            'No audit logging',
            'No session management',
            'No offline mode',
            'Limited error handling',
            'No loading states',
            'No optimistic UI updates'
          ]}
        />

        <LimitationCard 
          title="Security Limitations"
          items={[
            'No 2FA/MFA support',
            'No biometric authentication',
            'No secure password generator',
            'No breach monitoring',
            'No session timeout',
            'No clipboard clearing',
            'No screenshot protection',
            'No master password strength requirements'
          ]}
        />

        <LimitationCard 
          title="UX Limitations"
          items={[
            'Must re-enter master password after refresh',
            'All passwords decrypt at once',
            'No copy-to-clipboard button',
            'No auto-lock feature',
            'No dark/light mode toggle',
            'Limited mobile responsiveness',
            'No keyboard shortcuts',
            'No undo/redo functionality'
          ]}
        />
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30 mt-8">
        <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center gap-2">
          <Workflow className="w-5 h-5" />
          Recommended Next Steps
        </h3>
        <div className="space-y-3 text-gray-300">
          <p><strong className="text-blue-200">Phase 1 (Critical):</strong> Implement HTTPS, authentication, and fix CORS policy</p>
          <p><strong className="text-blue-200">Phase 2 (High Priority):</strong> Add rate limiting, input validation, and upsert pattern</p>
          <p><strong className="text-blue-200">Phase 3 (Enhancement):</strong> Implement update functionality, password generator, and better UX</p>
          <p><strong className="text-blue-200">Phase 4 (Advanced):</strong> Add multi-user support, 2FA, and audit logging</p>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all">
      <Icon className="w-10 h-10 text-purple-400 mb-3" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function TechStack({ category, technologies }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
      <h4 className="text-lg font-semibold text-purple-300 mb-3">{category}</h4>
      <ul className="space-y-2">
        {technologies.map((tech, idx) => (
          <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LayerCard({ title, items, color }) {
  const colors = {
    purple: 'border-purple-500/30 bg-purple-900/20',
    blue: 'border-blue-500/30 bg-blue-900/20',
    green: 'border-green-500/30 bg-green-900/20'
  };

  return (
    <div className={`rounded-xl p-6 border ${colors[color]}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkflowSection({ title, steps }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-semibold text-purple-300 mb-4">{title}</h3>
      <ol className="space-y-3">
        {steps.map((step, idx) => (
          <li key={idx} className="text-gray-300 text-sm flex gap-3">
            <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              {idx + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SecuritySection({ title, icon: Icon, items, positive }) {
  const colorClass = positive ? 'border-green-500/30 bg-green-900/20' : 'border-red-500/30 bg-red-900/20';
  const iconColor = positive ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`rounded-xl p-6 border ${colorClass}`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Icon className={`w-6 h-6 ${iconColor}`} />
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="border-l-2 border-slate-600 pl-4">
            <h4 className="font-semibold text-white text-sm mb-1">{item.heading}</h4>
            <p className="text-gray-400 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LimitationCard({ title, items }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
            <span className="text-red-400 mt-1">✗</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}