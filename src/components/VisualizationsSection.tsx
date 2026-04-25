import conePlot from "../assets/cone_plot.png";
import shapBar from "../assets/shap_bar.png";
import shapBeeswarm from "../assets/shap_beeswarm.png";

const vizItems = [
  {
    src: conePlot,
    title: "2025 Corn Yield Forecast — Cone of Uncertainty",
    description:
      "Five side-by-side line charts — one per state (IA, CO, WI, MO, NE) — tracking predicted yield at four season checkpoints: Aug 1, Sep 1, Oct 1, and End of Season. Shaded confidence intervals narrow as the season progresses and more satellite observations accumulate.",
    badge: "Time series",
    wide: true,
  },
  {
    src: shapBar,
    title: "Feature Importance — EOS Yield Model (SHAP)",
    description:
      "Mean absolute SHAP values ranking every predictor by its average impact magnitude on the final yield estimate. Precipitation standard deviation, mean minimum temperature, maximum temperature, and total precipitation lead the ranking, followed by Prithvi-100M foundation model embedding dimensions.",
    badge: "Explainability",
    wide: false,
  },
  {
    src: shapBeeswarm,
    title: "SHAP Beeswarm — Feature Impact Direction",
    description:
      "Each dot represents one county observation. Dots are spread horizontally by their SHAP value (left = pushes yield down, right = pushes yield up) and colored by raw feature value from low (blue) to high (red), revealing whether high precipitation helps or hurts yield in each context.",
    badge: "Explainability",
    wide: false,
  },
];

export function VisualizationsSection() {
  return (
    <section className="viz-section">
      <div className="viz-header">
        <p className="card-kicker">Model outputs</p>
        <h2 className="viz-title">Forecast results and explainability.</h2>
        <p className="viz-subtitle">
          Three views into the 2025 EOS corn yield model — temporal uncertainty
          cones and the climate and Prithvi-100M embedding features driving each
          estimate.
        </p>
      </div>

      <div className="viz-grid">
        {vizItems.map((item) => (
          <article
            key={item.title}
            className={`viz-card${item.wide ? " viz-card-wide" : ""}`}
          >
            <div className="viz-img-wrap">
              <img src={item.src} alt={item.title} className="viz-img" />
              <span className="viz-badge">{item.badge}</span>
            </div>
            <div className="viz-caption">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
