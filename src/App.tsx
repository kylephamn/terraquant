import { useEffect, useState } from "react";
import { mockDashboard } from "./mockData";

type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "terraquant-theme";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const nextTheme = theme === "dark" ? "light" : "dark";

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

          <div className="project-meta">
            <span>{mockDashboard.project.name}</span>
            <span>{mockDashboard.project.mode}</span>
            <span>{mockDashboard.project.updatedAt}</span>
          </div>

          <div className="hero-actions">
            <button type="button" className="primary-button">
              Launch analysis
            </button>
            <button type="button" className="secondary-button">
              View sample project
            </button>
            <button
              type="button"
              className="secondary-button theme-toggle"
              onClick={() => setTheme(nextTheme)}
              aria-label={`Switch to ${nextTheme} mode`}
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>

          <dl className="metrics-grid">
            {mockDashboard.metrics.map((metric) => (
              <div key={metric.label} className="metric-card">
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <span>{mockDashboard.project.region}</span>
            <span className="panel-badge">Model ready</span>
          </div>

          <div className="map-card">
            <div className="map-orbit map-orbit-one" />
            <div className="map-orbit map-orbit-two" />
            <div className="map-core">
              <span>{mockDashboard.project.region}</span>
              <strong>Coastal update</strong>
            </div>
          </div>

          <div className="signal-list">
            {mockDashboard.signals.map((signal) => (
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
            {mockDashboard.pipelineSteps.map((step, index) => (
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

      <section className="mock-grid">
        <article className="card mock-card mock-card-wide">
          <p className="card-kicker">Dataset source</p>
          <h2>{mockDashboard.dataSource.label}</h2>
          <div className="source-meta">
            <span>{mockDashboard.dataSource.provider}</span>
            <span>{mockDashboard.dataSource.rows.toLocaleString()} rows</span>
            <span>Query ID {mockDashboard.dataSource.queryId}</span>
          </div>
          <a
            className="dataset-link"
            href={mockDashboard.dataSource.url}
            target="_blank"
            rel="noreferrer"
          >
            Open USDA Quick Stats result
          </a>
          <div className="source-columns">
            {mockDashboard.dataSource.keyColumns.map((column) => (
              <span key={column} className="tag-pill">
                {column}
              </span>
            ))}
          </div>
        </article>

        <article className="card mock-card">
          <p className="card-kicker">Mock structures</p>
          <h2>Reusable dataset shapes for testing the UI.</h2>
          <div className="mock-list">
            {mockDashboard.datasets.map((dataset) => (
              <div key={dataset.name} className="mock-row">
                <div>
                  <strong>{dataset.name}</strong>
                  <p>{dataset.source}</p>
                </div>
                <div className="mock-row-meta">
                  <span>{dataset.resolution}</span>
                  <span>{dataset.coverage}</span>
                  <span>{dataset.freshness}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card mock-card">
          <p className="card-kicker">Mock jobs</p>
          <h2>Pipeline states that are easy to swap out later.</h2>
          <div className="mock-list">
            {mockDashboard.jobs.map((job) => (
              <div key={job.id} className="mock-row">
                <div>
                  <strong>
                    {job.id} · {job.name}
                  </strong>
                  <p>{job.eta}</p>
                </div>
                <div className="mock-tags">
                  <span className={`status-pill ${job.status}`}>
                    {job.status}
                  </span>
                  {job.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card mock-card mock-card-wide">
          <p className="card-kicker">Mock exports</p>
          <h2>Output formats for downstream review and handoff.</h2>
          <div className="export-grid">
            {mockDashboard.exports.map((item) => (
              <div key={item.format} className="export-item">
                <strong>{item.format}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
