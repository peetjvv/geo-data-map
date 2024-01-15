# Geo Data Map

[![Checks](https://github.com/peetjvv/geo-data-map/actions/workflows/checks.yaml/badge.svg)](https://github.com/peetjvv/geo-data-map/actions/workflows/checks.yaml)

Pet project to play around with Mapbox's various features. Idea is to eventually store various open source geographic datasets and visualise them nicely on the map.

## Software Requirements

- node 18
- npm

## Running locally

1. Clone the repo
2. cd into the repo root directory
3. Install dependencies with `npm ci`
4. Generate a Mapbox token and add it to a file called `.env.dev` in the repo root. Use env variable name `MAPBOX_TOKEN`.
5. Start by running `npm start`
6. Navigate to `localhost:8080` in your browser.
