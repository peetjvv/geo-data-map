import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './scss/main.scss';

const container = document.getElementById('app');
const root = createRoot(container!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
root.render(<App />);
