import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Renovation Concierge</h1>
        <p className="text-slate-600">
          Concierge-style renovation management for busy homeowners.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
