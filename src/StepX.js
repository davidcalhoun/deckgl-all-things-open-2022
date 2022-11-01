import React from 'react';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import { registerLoaders } from '@loaders.gl/core';
import { CSVLoader } from '@loaders.gl/csv';
import Map from 'react-map-gl';
import { scaleRadial } from 'd3-scale';
import { DataFilterExtension } from '@deck.gl/extensions';

import './styles.css';

registerLoaders(CSVLoader);

//import {load} from '@loaders.gl/core';

// The pre-registered CSVLoader gets auto selected based on file extension...
//const data = await load('data.csv');

let logCount = 0;
const logOnce = (message) => {
    if (logCount === 0) {
        console.log(message);
        logCount++;
    }
};

// CSV 284 KB gzipped down the wire, 734 KB uncompressed
const EPA_2021_CH4_DATA = './epa-ch4-2021.csv';

const CSV_METHANE_KEY = 'Methane (CH4) emissions metric tons carbon equivalent';
const CSV_INDUSTRY_TYPE_KEY = 'Industry Type (sectors)';

const scale = scaleRadial().domain([1, 2080109]).rangeRound([1, 25]);
const methaneToRadius = (methane) => {
    return scale(methane);
};

const FILL_COLORS = {
    'Petroleum and Natural Gas Systems': [129, 15, 124],
    'Power Plants': [142, 154, 175],
    Waste: [127, 85, 57],
    Other: [113, 131, 85]
};

export default function App() {
    const layers = [
        new ScatterplotLayer({
            id: 'scatterplot-layer',
            data: EPA_2021_CH4_DATA,
            pickable: true,
            opacity: 0.8,
            stroked: true,
            filled: true,
            radiusUnits: 'pixels',
            radiusMinPixels: 1,
            radiusMaxPixels: 25,
            getPosition: ({ Latitude, Longitude }) => [Longitude, Latitude],
            getRadius: (csvRowObj) => {
                // highest methane value is 2268589

                const methaneTonsCO2Equivalent = csvRowObj[CSV_METHANE_KEY];
                logOnce(111, methaneToRadius(methaneTonsCO2Equivalent));
                //Math.sqrt(d.exits)
                return methaneToRadius(methaneTonsCO2Equivalent);
            },

            getFillColor: (data) => {
                const industry = data[CSV_INDUSTRY_TYPE_KEY];

                return FILL_COLORS[industry] || FILL_COLORS.Other;
            },
            lineWidthUnits: 'pixels',
            getLineWidth: () => 0,
            lineWidthMinPixels: 0,
            lineWidthMaxPixels: 0,
            //getLineColor: (d) => [0, 0, 0],
            onClick: (data) => {
                console.log(data.object);
                console.log(111, methaneToRadius(data.object[CSV_METHANE_KEY]));
            },
            highlightColor: [191, 211, 230],
            autoHighlight: true,

            getFilterValue: (data) => {
                console.log(222, data[CSV_METHANE_KEY]);
                return data[CSV_METHANE_KEY];
            },
            filterRange: [500000, 2268589]
            extensions: [new DataFilterExtension({ filterSize: 1 })]
        })
    ];

    return (
        <div className="App">
            <DeckGL
                initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 3.5
                }}
                controller={true}
                layers={layers}
            >
                <Map
                    style={{ width: '100vw', height: '100vh' }}
                    mapStyle="mapbox://styles/mapbox/light-v10"
                    /* Mapbox access token required for map base tiles to display.  See readme. */
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                />
            </DeckGL>
        </div>
    );
}
