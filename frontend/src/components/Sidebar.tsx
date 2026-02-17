import { AppConnection, EmailAccount } from "../types";

export function Sidebar({
  active,
  setActive,
  emailAccounts,
  apps,
}: {
  active: string;
  setActive: (v: string) => void;
  emailAccounts: EmailAccount[];
  apps: AppConnection[];
}) {
  return (
    <aside className="sidebar">
      <h2>Support Hub</h2>
      <button onClick={() => setActive("unified")}>Unified Inbox</button>
      <button onClick={() => setActive("emails")}>Emails</button>
      <button onClick={() => setActive("reviews")}>⭐ App Reviews</button>
      <button onClick={() => setActive("analytics")}>Analytics</button>
      <button onClick={() => setActive("settings")}>Settings</button>

      <div className="sub">
        <h4>Email Accounts</h4>
        {emailAccounts.map((a) => (
          <button key={a.id} onClick={() => setActive(`email:${a.id}`)}>
            {a.address}
          </button>
        ))}
      </div>

      <div className="sub">
        <h4>Apps</h4>
        {apps.map((a) => (
          <button key={a.id} onClick={() => setActive(`app:${a.id}`)}>
            {a.appName}
          </button>
        ))}
      </div>
    </aside>
  );
}
