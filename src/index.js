import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Step1 from './Step1';
import Step2 from './Step2';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <Step1 />
    </StrictMode>
);
