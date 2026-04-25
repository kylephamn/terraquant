export type SignalTone = "good" | "warn" | "neutral";

export interface PipelineStep {
  title: string;
  description: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface Signal {
  label: string;
  value: string;
  tone: SignalTone;
}

export interface DatasetMock {
  name: string;
  source: string;
  resolution: string;
  coverage: string;
  freshness: string;
}

export interface JobMock {
  id: string;
  name: string;
  status: "queued" | "running" | "review";
  eta: string;
  tags: string[];
}

export interface ExportPreset {
  format: string;
  description: string;
}

export interface ExternalDatasetSource {
  label: string;
  provider: string;
  url: string;
  rows: number;
  queryId: string;
  keyColumns: string[];
}

export const mockDashboard = {
  project: {
    name: "TerraQuant / Coastal Watch",
    region: "Region 07",
    mode: "Sentinel + drone fusion",
    updatedAt: "Apr 24, 2026 14:20 UTC",
  },
  dataSource: {
    label: "USDA NASS Quick Stats",
    provider: "USDA National Agricultural Statistics Service",
    url: "https://quickstats.nass.usda.gov/results/40B1D878-9E6C-30A2-88C4-7CDE7AD2FDE6",
    rows: 37504,
    queryId: "40B1D878-9E6C-30A2-88C4-7CDE7AD2FDE6",
    keyColumns: [
      "Program",
      "Year",
      "Geo Level",
      "State",
      "County",
      "Commodity",
      "Data Item",
      "Value",
      "CV (%)",
    ],
  } satisfies ExternalDatasetSource,
  metrics: [
    { label: "Scenes processed", value: "128" },
    { label: "Mean confidence", value: "94.2%" },
    { label: "Active regions", value: "12" },
    { label: "Time saved", value: "18h" },
  ] satisfies Metric[],
  signals: [
    { label: "Vegetation health", value: "Stable", tone: "good" },
    { label: "Water index", value: "Elevated", tone: "warn" },
    { label: "Change detection", value: "Low drift", tone: "good" },
  ] satisfies Signal[],
  pipelineSteps: [
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
  ] satisfies PipelineStep[],
  datasets: [
    {
      name: "USDA Corn Yield by County",
      source: "NASS Quick Stats",
      resolution: "County-level",
      coverage: "National (U.S.)",
      freshness: "2024 survey snapshot",
    },
    {
      name: "Drone survey batch",
      source: "Field uploads",
      resolution: "4 cm",
      coverage: "1.8 km2",
      freshness: "18 minutes ago",
    },
    {
      name: "Historical baseline",
      source: "Archive",
      resolution: "30 m",
      coverage: "6 years",
      freshness: "Synced daily",
    },
  ] satisfies DatasetMock[],
  jobs: [
    {
      id: "JOB-201",
      name: "Tile normalization",
      status: "running",
      eta: "03:14 remaining",
      tags: ["preprocess", "priority"],
    },
    {
      id: "JOB-198",
      name: "Segmentation inference",
      status: "review",
      eta: "Waiting for approval",
      tags: ["model", "gpu"],
    },
    {
      id: "JOB-197",
      name: "Waterline export",
      status: "queued",
      eta: "Starts next",
      tags: ["export", "batch"],
    },
  ] satisfies JobMock[],
  exports: [
    { format: "GeoJSON", description: "Region overlays and class boundaries" },
    {
      format: "COG",
      description: "Cloud-optimized rasters with confidence bands",
    },
    { format: "CSV", description: "Summary metrics for reporting and QA" },
  ] satisfies ExportPreset[],
};
