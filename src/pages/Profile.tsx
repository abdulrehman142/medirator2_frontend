import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-lg px-4 py-12 font-ibm-plex-mono">
      <h1 className="font-jersey text-4xl text-[#0B3C5D] dark:text-white">
        Profile
      </h1>
      <div className="mt-6 rounded-2xl border-2 border-[#0B3C5D] bg-white p-5 dark:border-white/20 dark:bg-black">
        {user?.picture && (
          <img
            src={user.picture}
            alt={user.name}
            className="mb-4 h-16 w-16 rounded-full"
          />
        )}
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-black/50 dark:text-white/50">Name</dt>
            <dd className="font-medium">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-black/50 dark:text-white/50">Email</dt>
            <dd className="font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-black/50 dark:text-white/50">Role</dt>
            <dd className="font-medium">{user?.role}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
