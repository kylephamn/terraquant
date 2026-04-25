import type { ThemeMode } from "../hooks/useTheme";
import { mockDashboard } from "../mockData";

interface HeroProps {
  theme: ThemeMode;
  nextTheme: ThemeMode;
  onToggleTheme: () => void;
}

export function Hero({ theme, nextTheme, onToggleTheme }: HeroProps) {
  return (
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
            onClick={onToggleTheme}
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

        <div className="map-card" aria-label="Region preview placeholder">
          <div className="map-orbit map-orbit-one" />
          <div className="map-orbit map-orbit-two" />
          <div className="map-core">
            <span>{mockDashboard.project.region}</span>
            <strong>Coastal update</strong>
            <span className="map-placeholder-label">Preview</span>
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
  );
}
