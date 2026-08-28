import { adminLogin } from "@/lib/actions/auth";
import { LOGO_URL } from "@/lib/constants";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; callbackUrl?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-deep px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={LOGO_URL}
            alt="George McKye Logo"
            width={64}
            height={64}
            className="rounded-full object-cover border border-brand-primary/10 mb-4"
          />
          <h1 className="text-xl font-bold text-brand-deep">Admin Panel</h1>
          <p className="text-sm text-gray-500">Sign in to manage George McKye</p>
        </div>

        <form action={adminLogin} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={searchParams.callbackUrl || ""} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {searchParams.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {searchParams.error}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 rounded-md hover:bg-brand-deep transition-colors"
          >
            <Lock size={18} />
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
}
