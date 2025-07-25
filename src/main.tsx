import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ErrorBoundary } from './error-boundary';

const rootElement =
  document.querySelector('#root') ??
  ((): HTMLDivElement => {
    const element = document.createElement('div');
    element.id = 'root';
    document.body.append(element);
    return element;
  })();

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
      ,
    </ErrorBoundary>
  </StrictMode>
);
