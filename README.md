# ndt-report-webapp

## Deployment Instructions
1. Clone the repository
   ```
    > git clone https://github.com/PercySpecter/ndt-report-webapp
    > cd ndt-report-app
   ```
2. Set environment in `scripts/env.json`
   ```
    env = {
      "api_root_url" : "http://www.sample-api.com", // Your API server root URL
      "webapp_root_url" : "http://www.sample-webapp.com", // Root URL of this webapp
      "start_year" : 1980,  // no change needed
      "category": ["Survey", "Breakdown", "Preventive Maintenance"] // no change needed
    }
   ```
3. Launch the App
   > Open `index.html` in any web browser