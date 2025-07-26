import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ErrorBoundary } from './error-boundary';
import About from './about';
import NotFound from './404';
import DetailCard from './detail';

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
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route path="detail/:id" element={<DetailCard />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
