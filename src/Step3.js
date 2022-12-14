/**
 * Step 3: scatterplot styling adjustments (radius, color, and opacity).
 * Visualization goal: answer the question "where are the biggest methane emissions and who is responsible?"
 * This step starts to tell the "where are the biggest emissions" part of the story.
 */
import React from 'react';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import { registerLoaders } from '@loaders.gl/core';
import { CSVLoader } from '@loaders.gl/csv';
import Map from 'react-map-gl';
import { scaleRadial } from 'd3-scale';

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
    /**
     * radiusScale maps from methane value to pixel value.
     * Example usage:
     * radiusScale(2268589);
     * // -> 25
     */
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
            /**
             * radiusUnits defaults to 'meters', so we need to tell deck.gl to use 'pixels' instead.
             * This ensures that bubbles are the same size regardless of zoom level.
             */
            radiusUnits: 'pixels',
            /**
             * We need to let deck.gl know how translate the CSV row entry into a radius,
             * so we'll tell it to use our custom radiusScale.
             */
            getRadius: (csvRowObj) => {
                const methaneTonsCO2Equivalent = csvRowObj[CSV_METHANE_KEY];
                return radiusScale(methaneTonsCO2Equivalent);
            },
            /**
             * Make the points look nice.  Caution though!  Colors can affect understanding, mood, etc.
             * For instance, selecting red colors will signal "danger" in Western countries, which isn't
             * the story we want to tell here.  Other colors have other associations, such as blue meaning
             * "cold", which is confusing since our story is connected to climate warming.
             * See more:
             * https://en.wikipedia.org/wiki/Stroop_effect
             * https://informationisbeautiful.net/visualizations/colours-in-cultures/
             */
            getFillColor: COLORS.PURPLE,
            /**
             * Make semitransparent so we can better see circles even if they're overlapping.  Also helps us
             * see the underlying map tiles (especially if they're satellite tiles!).
             */
            opacity: 0.4
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
