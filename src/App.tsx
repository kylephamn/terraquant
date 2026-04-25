import { useEffect, useState } from "react";
import { mockDashboard } from "./mockData";
import { parseUsdaDelimitedFile } from "./usdaImport";

type ThemeMode = "dark" | "light";

interface ImportedDatasetPreview {
  fileName: string;
  rowCount: number;
  headers: string[];
  sampleRows: Array<Record<string, string>>;
}

const THEME_STORAGE_KEY = "terraquant-theme";

const FIELD_ALIASES: Record<string, string[]> = {
  Program: ["program"],
  Year: ["year", "program year", "reference_period_desc"],
  "Geo Level": ["geo level", "level_desc"],
  State: ["state", "state_name", "state_alpha"],
  County: ["county", "county_name"],
  Commodity: ["commodity", "commodity_desc"],
  "Data Item": ["data item", "short_desc", "statisticcat_desc"],
  Value: ["value", "Value"],
  "CV (%)": ["cv (%)", "cv", "cv_percent"],
};

const REQUIRED_MAPPING_COLUMNS = ["Year", "County", "Data Item", "Value"];

function getInitialColumnMapping(headers: string[]): Record<string, string> {
  const lowerToOriginal = new Map(
    headers.map((header) => [header.trim().toLowerCase(), header]),
  );

  const mapping: Record<string, string> = {};
  for (const targetColumn of mockDashboard.dataSource.keyColumns) {
    const aliases = FIELD_ALIASES[targetColumn] ?? [targetColumn.toLowerCase()];
    const match = aliases
      .map((alias) => lowerToOriginal.get(alias.toLowerCase()))
      .find(Boolean);
    mapping[targetColumn] = match ?? "";
  }

  return mapping;
}

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
  const [importedDataset, setImportedDataset] =
    useState<ImportedDatasetPreview | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!importedDataset) {
      setColumnMapping({});
      return;
    }
    setColumnMapping(getInitialColumnMapping(importedDataset.headers));
  }, [importedDataset]);

  const nextTheme = theme === "dark" ? "light" : "dark";

  const displayedRows =
    importedDataset?.rowCount ?? mockDashboard.dataSource.rows;
  const displayedColumns =
    importedDataset?.headers.slice(0, 12) ??
    mockDashboard.dataSource.keyColumns;
  const mappedCount = mockDashboard.dataSource.keyColumns.filter(
    (column) => (columnMapping[column] ?? "") !== "",
  ).length;
  const missingRequiredColumns = REQUIRED_MAPPING_COLUMNS.filter(
    (column) => (columnMapping[column] ?? "") === "",
  );
  const isMappingReady = missingRequiredColumns.length === 0;

  async function handleDatasetImport(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseUsdaDelimitedFile(text);

      setImportedDataset({
        fileName: file.name,
        rowCount: parsed.rows.length,
        headers: parsed.headers,
        sampleRows: parsed.rows.slice(0, 5),
      });
      setImportError(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown parse error.";
      setImportedDataset(null);
      setImportError(`Could not parse file. ${message}`);
    }

    event.target.value = "";
  }

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
            <span>{displayedRows.toLocaleString()} rows</span>
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
            {displayedColumns.map((column) => (
              <span key={column} className="tag-pill">
                {column}
              </span>
            ))}
          </div>

          <div className="import-panel">
            <label className="upload-label" htmlFor="usda-upload">
              Import USDA Spreadsheet Export (CSV/TSV)
            </label>
            <input
              id="usda-upload"
              className="upload-input"
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={handleDatasetImport}
            />
            {importError ? (
              <p className="import-error">{importError}</p>
            ) : importedDataset ? (
              <p className="import-note">
                Loaded {importedDataset.fileName} with{" "}
                {importedDataset.rowCount.toLocaleString()} rows.
              </p>
            ) : (
              <p className="import-note">
                No local file loaded yet. Upload an exported Quick Stats file to
                preview columns.
              </p>
            )}
          </div>

          {importedDataset ? (
            <div className="import-results">
              <div className="mapping-panel">
                <div className="mapping-header">
                  <h3>Column mapping</h3>
                  <span>
                    {mappedCount}/{mockDashboard.dataSource.keyColumns.length} mapped
                  </span>
                </div>
                <p>
                  Auto-mapped what it could. Review and adjust fields before using
                  this file downstream.
                </p>
                {isMappingReady ? (
                  <p className="mapping-status ok">
                    Required fields are mapped. This file is ready for downstream
                    analysis.
                  </p>
                ) : (
                  <p className="mapping-status warn">
                    Missing required fields: {missingRequiredColumns.join(", ")}
                  </p>
                )}
                <div className="mapping-grid">
                  {mockDashboard.dataSource.keyColumns.map((targetColumn) => (
                    <label key={targetColumn} className="mapping-row">
                      <span>{targetColumn}</span>
                      <select
                        value={columnMapping[targetColumn] ?? ""}
                        onChange={(event) => {
                          const selectedHeader = event.target.value;
                          setColumnMapping((prev) => ({
                            ...prev,
                            [targetColumn]: selectedHeader,
                          }));
                        }}
                      >
                        <option value="">Not mapped</option>
                        {importedDataset.headers.map((header) => (
                          <option key={`${targetColumn}-${header}`} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>

              <div className="table-wrap">
                <table className="preview-table">
                  <thead>
                    <tr>
                      {importedDataset.headers.slice(0, 6).map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importedDataset.sampleRows.map((row, rowIndex) => (
                      <tr key={`sample-${rowIndex}`}>
                        {importedDataset.headers.slice(0, 6).map((header) => (
                          <td key={`${rowIndex}-${header}`}>{row[header]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
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
