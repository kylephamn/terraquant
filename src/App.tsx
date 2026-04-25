const pipelineSteps = [
  {
    title: "Ingest imagery",
    description:
      "Drop Sentinel and drone imagery into one queue and normalize it for analysis.",
  },
  {
    title: "Run segmentation",
    description:
      "Use a model-backed inference pass to isolate surfaces, water, vegetation, and anomalies.",
  },
  {
    title: "Review insights",
    description:
      "Inspect metrics, confidence, and exportable overlays before handing results off.",
  },
];

const metrics = [
  { label: "Scenes processed", value: "128" },
  { label: "Mean confidence", value: "94.2%" },
  { label: "Active regions", value: "12" },
  { label: "Time saved", value: "18h" },
];

const signals = [
  { label: "Vegetation health", value: "Stable", tone: "good" },
  { label: "Water index", value: "Elevated", tone: "warn" },
  { label: "Change detection", value: "Low drift", tone: "good" },
];

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">TerraQuant control room</p>
          <h1>Turn geospatial data into decisions fast.</h1>
          <p className="lede">
            A focused React dashboard for reviewing imagery, monitoring model
            output, and surfacing the signals that matter.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-button">
              Launch analysis
            </button>
            <button type="button" className="secondary-button">
              View sample project
            </button>
          </div>

          <dl className="metrics-grid">
            {metrics.map((metric) => (
              <div key={metric.label} className="metric-card">
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <span>Live overview</span>
            <span className="panel-badge">Model ready</span>
          </div>

          <div className="map-card">
            <div className="map-orbit map-orbit-one" />
            <div className="map-orbit map-orbit-two" />
            <div className="map-core">
              <span>Region 07</span>
              <strong>Coastal update</strong>
            </div>
          </div>

          <div className="signal-list">
            {signals.map((signal) => (
              <div key={signal.label} className="signal-row">
                <span>{signal.label}</span>
                <strong className={`signal ${signal.tone}`}>
                  {signal.value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="card accent-card">
          <p className="card-kicker">Workflow</p>
          <h2>Designed for a clean path from upload to insight.</h2>
          <p>
            This starter gives you a strong visual shell for future API
            integration, model status, and result review tools.
          </p>
        </article>

        <article className="card steps-card">
          <p className="card-kicker">Pipeline</p>
          <div className="steps">
            {pipelineSteps.map((step, index) => (
              <div key={step.title} className="step-row">
                <span className="step-index">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
