import { AppConnection, EmailAccount, EmailThread, Review } from "../types";

export function Panel({
  active,
  accounts,
  threads,
  reviews,
  apps,
  refresh,
}: {
  active: string;
  accounts: EmailAccount[];
  threads: EmailThread[];
  reviews: Review[];
  apps: AppConnection[];
  refresh: () => Promise<void>;
}) {
  async function emailAction(id: string, action: "reply" | "resolve") {
    if (action === "reply") {
      const draft = await fetch(`http://localhost:4000/api/emails/threads/${id}/reply-draft`, { method: "POST", headers: { "Content-Type": "application/json" } }).then((r) => r.json());
      await fetch(`http://localhost:4000/api/emails/threads/${id}/approve-send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalReply: draft.reply }),
      });
    } else {
      await fetch(`http://localhost:4000/api/emails/threads/${id}/resolve`, { method: "POST" });
    }
    await refresh();
  }

  async function reviewAction(id: string) {
    const draft = await fetch(`http://localhost:4000/api/reviews/items/${id}/reply-draft`, { method: "POST", headers: { "Content-Type": "application/json" } }).then((r) => r.json());
    await fetch(`http://localhost:4000/api/reviews/items/${id}/approve-post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finalReply: draft.reply }),
    });
    await refresh();
  }

  if (active.startsWith("email:")) {
    const accountId = active.split(":")[1];
    const account = accounts.find((a) => a.id === accountId);
    const items = threads.filter((t) => t.accountId === accountId);
    return <EmailBoard title={account?.address ?? "Email"} items={items} onAction={emailAction} />;
  }

  if (active.startsWith("app:")) {
    const appId = active.split(":")[1];
    const app = apps.find((a) => a.id === appId);
    const items = reviews.filter((r) => r.appId === appId);
    return <ReviewBoard title={app?.appName ?? "App"} items={items} onReply={reviewAction} />;
  }

  if (active === "unified") {
    return <EmailBoard title="Unified Inbox" items={threads} onAction={emailAction} />;
  }

  if (active === "reviews") {
    return <ReviewBoard title="All App Reviews" items={reviews} onReply={reviewAction} />;
  }

  return (
    <div className="panel">
      <h2>Welcome</h2>
      <p>Select a mailbox or app from the sidebar.</p>
    </div>
  );
}

function EmailBoard({ title, items, onAction }: { title: string; items: EmailThread[]; onAction: (id: string, action: "reply" | "resolve") => void }) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      {(["new", "replied", "resolved"] as const).map((state) => (
        <section key={state}>
          <h3>{state.toUpperCase()}</h3>
          {items.filter((i) => i.state === state).map((i) => (
            <article key={i.id} className="card">
              <b>{i.subject}</b>
              <p>{i.sender} • {new Date(i.receivedAt).toLocaleString()}</p>
              <p>Sentiment: {i.sentiment} | Category: {i.category} | Priority: {i.priority}</p>
              <p>{i.thread[0]}</p>
              {state === "new" && <button onClick={() => onAction(i.id, "reply")}>Approve & Send</button>}
              {state === "replied" && <button onClick={() => onAction(i.id, "resolve")}>Mark Resolved</button>}
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}

function ReviewBoard({ title, items, onReply }: { title: string; items: Review[]; onReply: (id: string) => void }) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      {(["new", "replied"] as const).map((state) => (
        <section key={state}>
          <h3>{state.toUpperCase()} REVIEWS</h3>
          {items.filter((i) => i.state === state).map((i) => (
            <article key={i.id} className="card">
              <b>{i.username} • {'⭐'.repeat(i.rating)}</b>
              <p>{new Date(i.date).toLocaleDateString()} {i.country ? `• ${i.country}` : ""}</p>
              <p>{i.text}</p>
              <p>Sentiment: {i.sentiment} | Category: {i.category}</p>
              {state === "new" && <button onClick={() => onReply(i.id)}>Approve & Post</button>}
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
