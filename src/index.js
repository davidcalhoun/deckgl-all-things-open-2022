import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        {/* Instructions: replace this with the step you'd like to preview! */}
        <Step1 />
    </StrictMode>
);
