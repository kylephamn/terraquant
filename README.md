```markdown
# TerraQuant: Geospatial AI for Corn Yield Forecasting

**TerraQuant** bridges the gap between satellite imagery, climate data, and agricultural ground truth to deliver real-time, multi-stage yield predictions. Built for the USDA and NASA Innovation Challenge, this project forecasts corn yields across Iowa, Colorado, Wisconsin, Missouri, and Nebraska, while mathematically modeling the "Cone of Uncertainty" to account for shifting weather patterns as the growing season progresses.

## 🌾 The Problem
Accurate crop yield forecasting is critical for global food security and supply chains. As traditional farmer survey response rates decline, there is a critical need to supplement surveys with automated, satellite-driven AI models. Our solution isolates pure crop pixels, tracks growth through time-series imagery, and quantifies the uncertainty of mid-season predictions.

## 📊 Our Data Stack
This project leverages the AWS Registry of Open Data and official USDA statistics to track the biophysical drivers of crop yield:
* **USDA NASS Quick Stats API**: Official historical corn grain yield records (bu/acre) serving as our model's ground truth training targets.
* **USDA Cropland Data Layer (CDL)**: 30-meter resolution rasters used to mask non-corn pixels, ensuring our model is not skewed by background noise or early-harvested silage (the "mixed pixel" problem).
* **NASA Harmonized Landsat Sentinel-2 (HLS)**: 30-meter surface reflectance imagery used to calculate the Normalized Difference Vegetation Index (NDVI) and track the corn canopy's greenness trajectory from emergence to maturity.
* **NASA SMAP L4**: Root-zone soil moisture data utilized to assess water availability, particularly during the highly sensitive silking stage.
* **NOAA GHCN-D / NASA POWER**: Daily temperature (Tmax/Tmin) and precipitation records to compute Growing Degree Days (GDD) and track thermal accumulation.

## 🧠 AI & Machine Learning Architecture
* **IBM/NASA Prithvi-100M**: A geospatial foundation model used as the satellite image encoder to produce 768-dimensional embeddings from our masked crop fields.
* **Quantile Regression Forests (QRF)**: To meet the requirement of generating a "Cone of Uncertainty" for forecasts on August 1, September 1, October 1, and the End of Season (EOS). As the season progresses, observed weather mechanically replaces simulated scenarios, causing our confidence intervals to organically narrow and converge on the final yield prediction.

## 📂 Repository Structure
```text
terraquant/
├── src/                  # React/Vite frontend source code
├── index.html            # Frontend entry point
├── package.json          # Node.js frontend dependencies
├── vite.config.ts        # Vite configuration
├── main.ipynb            # Core Jupyter Notebook for the ML/Data pipeline
├── usda_quickstats.ipynb # Data ingestion from USDA API
└── .env                  # Environment variables (API Keys)
```
*(Reference:)*

## 🚀 Setup & Installation Guide

This project is split into a Python/Jupyter backend for data processing and a Vite/React frontend for the interactive dashboard.

### 1. Data Science Environment (Backend)
If you do not already have Conda installed, please download and install [Miniconda](https://docs.conda.io/en/latest/miniconda.html). 

**Windows**: Open Anaconda Prompt or PowerShell.
**Mac/Linux**: Open your Terminal.

1. **Clone the repository and navigate inside**:
   ```bash
   git clone https://github.com/kylephamn/terraquant.git
   cd terraquant
   ```
2. **Create and activate the Conda environment**:
   ```bash
   conda env create -f environment.yml
   conda activate <env_name> 
   ```
   *(Check `environment.yml` for the exact environment name)*.
3. **Launch Jupyter Notebook**:
   ```bash
   jupyter notebook
   ```
   This will open a browser window where you can open `main.ipynb` and `usda_quickstats.ipynb` to run the data pipeline.

### 2. Dashboard Environment (Frontend)
Ensure you have Node.js and `npm` (or `yarn`) installed.
1. Open a new terminal window and navigate to the project directory.
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables
You will need to configure a `.env` file in the root directory with the following keys:
* `SH_CLIENT_ID` & `SH_CLIENT_SECRET` (For Sentinel Hub satellite data access, if applicable)
* `QUICKSTATS_API_KEY` (Request a free key at [USDA Quick Stats](https://quickstats.nass.usda.gov/api)).
```
