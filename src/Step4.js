/**
 * Step 4: filters out lower intensity emissions based on a hard-coded threshold (500000 tons methane CO2e).
 * Visualization goal: answer the question "where are the biggest methane emissions and who is responsible?"
 * This step helps declutter and only show the "biggest emissions" based on a hardcoded threshold.
 */
import React from 'react';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import { registerLoaders } from '@loaders.gl/core';
import { CSVLoader } from '@loaders.gl/csv';
import Map from 'react-map-gl';
import { scaleRadial } from 'd3-scale';
import { DataFilterExtension } from '@deck.gl/extensions';

import './styles.css';

/**
 * Let loaders.gl know that we need CSV support.
 */
registerLoaders(CSVLoader);

/**
 * Methane (CH4) reported to the EPA in 2021.
 * Via https://www.epa.gov/ghgreporting/data-sets (2021 Data Summary Spreadsheets, 2021 Direct Emitters)
 * CSV cleaned up and only includes fields we care about here.
 */
const METHANE_DATA_FILENAME = './epa-ch4-2021.csv';

const CSV_METHANE_KEY = 'Methane (CH4) emissions metric tons carbon equivalent';

const MAX_METHANE_TONS_CO2EQUIVALENT = 2268589;
const MAX_RADIUS_PIXELS = 25;

const COLORS = {
    PURPLE: [129, 15, 124]
};

export default function App() {
    const radiusScale = scaleRadial().domain([1, MAX_METHANE_TONS_CO2EQUIVALENT]).rangeRound([1, MAX_RADIUS_PIXELS]);

    const layers = [
        /**
         * Scatterplot renders as circles over the map.
         * See https://deck.gl/docs/api-reference/layers/scatterplot-layer
         */
        new ScatterplotLayer({
            id: 'scatterplot-layer',
            data: METHANE_DATA_FILENAME,
            radiusMinPixels: 1,
            /**
             * Maps the longitude and latitude in the CSV to a coordinate so the point
             * can be positioned correctly.  Note that coordinate order here is explicitly
             * [Longitude, Latitude] to conform to the GeoJSON spec.
             * See https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1
             */
            getPosition: ({ Longitude, Latitude }) => [Longitude, Latitude],

            // Step 3 additions
            radiusUnits: 'pixels',
            getRadius: (csvRowObj) => {
                const methaneTonsCO2Equivalent = csvRowObj[CSV_METHANE_KEY];
                return radiusScale(methaneTonsCO2Equivalent);
            },
            getFillColor: COLORS.PURPLE,
            opacity: 0.4,

            // Step 4 additions
            /**
             * getFilterValue tells deck.gl how to get the value we want to filter.
             */
            getFilterValue: (data) => data[CSV_METHANE_KEY],
            /**
             * Hard-coded filter to only show methane sources > 500,000 tons methane CO2e.
             */
            filterRange: [500000, MAX_METHANE_TONS_CO2EQUIVALENT],
            /**
             * Lets the layer know we're filtering on one value.  This filtering happens on the GPU!
             */
            extensions: [new DataFilterExtension({ filterSize: 1 })]
        })
    ];

    return (
        <div className="App">
            {/* Deck container for visualizations, see https://deck.gl/docs/api-reference/core/deck */}
            <DeckGL
                initialViewState={{
                    // Centers the map roughly over the US.
                    longitude: -100,
                    latitude: 40,
                    zoom: 3.5
                }}
                controller={true}
                layers={layers}
            >
                {/* react-map-gl for rendering base map tiles, see https://visgl.github.io/react-map-gl/docs/api-reference/map */}
                <Map
                    style={{ width: '100vw', height: '100vh' }}
                    /** Use a premade base map style from https://docs.mapbox.com/api/maps/styles/ or create your own at studio.mapbox.com/  */
                    mapStyle="mapbox://styles/mapbox/light-v10"
                    /* Mapbox access token required for map base tiles to display.  See readme. */
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                />
            </DeckGL>
        </div>
    );
}
