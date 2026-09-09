import { ThemeProvider } from './providers/ThemeProvider';
import { ApolloProvider } from './providers/ApolloProvider';
import { RouterProvider } from './providers/RouterProvider';
import { ToastProvider } from '../shared/ui/Toast/Toast';

import './styles/index.css';
import './styles/animations.css';
import './styles/typography.css';

export function App() {
  return (
    <ThemeProvider>
      <ApolloProvider>
        <ToastProvider>
          <RouterProvider />
        </ToastProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
