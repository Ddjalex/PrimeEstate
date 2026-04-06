const securityModules = [
  {
    name: "Campaign Consent Gate",
    description:
      "Requires documented authorization before any simulation can launch.",
  },
  {
    name: "Awareness Metrics",
    description:
      "Tracks click, report, and completion rates without collecting credentials.",
  },
  {
    name: "Account Hardening",
    description:
      "Guides users through enabling Telegram 2FA, active session reviews, and recovery checks.",
  },
];

export function Dashboard() {
  return (
    <main className="container">
      <h1>Security Awareness Simulation Console</h1>
      <p>
        This environment is restricted to approved phishing simulations and
        defensive account-protection workflows.
      </p>

      <section>
        <h2>Enabled Modules</h2>
        <ul>
          {securityModules.map((module) => (
            <li key={module.name}>
              <strong>{module.name}</strong>
              <p>{module.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Next Steps</h2>
        <ol>
          <li>Connect backend API at <code>/api</code>.</li>
          <li>Add SSO + role-based controls for security teams.</li>
          <li>Wire anonymized analytics to MongoDB.</li>
        </ol>
      </section>
    </main>
  );
}
