import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Panel } from "./components/Panel";
import { useTheme } from "./context/theme";
import { AppConnection, EmailAccount, EmailThread, Review } from "./types";

export default function App() {
  const [active, setActive] = useState("unified");
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [apps, setApps] = useState<AppConnection[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const { dark, toggle } = useTheme();

  const refresh = async () => {
    const [a, t, p, r, n] = await Promise.all([
      fetch("http://localhost:4000/api/emails/accounts").then((x) => x.json()),
      fetch("http://localhost:4000/api/emails/threads").then((x) => x.json()),
      fetch("http://localhost:4000/api/reviews/apps").then((x) => x.json()),
      fetch("http://localhost:4000/api/reviews/items").then((x) => x.json()),
      fetch("http://localhost:4000/api/analytics").then((x) => x.json()),
    ]);
    setAccounts(a);
    setThreads(t);
    setApps(p);
    setReviews(r);
    setAnalytics(n);
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div className="layout">
      <Sidebar active={active} setActive={setActive} emailAccounts={accounts} apps={apps} />
      <main>
        <header>
          <h1>Support & App Review Dashboard</h1>
          <button onClick={toggle}>{dark ? "Light" : "Dark"} Mode</button>
        </header>

        {active === "analytics" ? (
          <div className="panel">
            <h2>Analytics</h2>
            <pre>{JSON.stringify(analytics, null, 2)}</pre>
          </div>
        ) : active === "settings" ? (
          <div className="panel">
            <h2>Settings</h2>
            <p>Manage connected Gmail accounts/apps and AI preferences via APIs.</p>
            <code>/api/settings/preferences, /api/emails/accounts, /api/reviews/apps</code>
          </div>
        ) : (
          <Panel active={active} accounts={accounts} threads={threads} reviews={reviews} apps={apps} refresh={refresh} />
        )}
      </main>
    </div>
  );
}
