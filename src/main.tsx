import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from './app/providers/ApolloProvider';
import { RouterProvider } from './app/providers/RouterProvider';
import { ThemeProvider } from './app/providers/ThemeProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ApolloProvider>
        <RouterProvider />
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode>
);
