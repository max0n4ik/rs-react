import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/page/App';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import About from '@/page/About';
import NotFound from '@/page/NotFound';
import DetailCard from '@/page/Detail';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/ThemeProvider';

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
          <Route
            path="/"
            element={
              <Provider store={store}>
                <ThemeProvider>
                  <App />
                </ThemeProvider>
              </Provider>
            }>
            <Route
              path="detail/:id"
              element={
                <ThemeProvider>
                  <DetailCard />
                </ThemeProvider>
              }
            />
          </Route>
          <Route
            path="about"
            element={
              <ThemeProvider>
                <About />
              </ThemeProvider>
            }
          />
          <Route
            path="*"
            element={
              <ThemeProvider>
                <NotFound />
              </ThemeProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
