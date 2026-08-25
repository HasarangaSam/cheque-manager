import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand */}
      <div className="mb-8 text-center relative z-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-lg shadow-lg shadow-indigo-600/30 mb-4">
          CM
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          ChequeManager
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Authorized Financial Ledger & Cheque Management Portal
        </p>
      </div>

      {/* Clerk Sign-In Component (Sign-Up removed) */}
      <div className="relative z-10 w-full flex justify-center [&_.cl-footerAction]:hidden [&_.cl-footer]:hidden [&_.cl-footerPages]:hidden">
        <SignIn
          appearance={{
            elements: {
              card: "bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton:
                "bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
              formFieldLabel: "text-slate-300 font-medium text-xs",
              formFieldInput:
                "bg-slate-950 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 rounded-lg",
              formButtonPrimary:
                "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 py-2.5 rounded-lg transition-all",
              footer: "hidden",
              footerAction: "hidden",
              footerActionText: "hidden",
              footerActionLink: "hidden",
              footerPages: "hidden",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-indigo-400",
            },
          }}
        />
      </div>

      {/* Footer security note */}
      <div className="mt-8 text-center text-[11px] text-slate-500 relative z-10">
        🔒 Strictly restricted to authorized single-operator access.
      </div>
    </div>
  );
}
