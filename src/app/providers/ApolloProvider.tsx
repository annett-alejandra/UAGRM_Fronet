import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { type ReactNode } from 'react';
import { env } from '../../shared/config/env';

const httpLink = createHttpLink({
  uri: env.GRAPHQL_URL,
  // credentials: 'include', // DESACTIVADO SSO
});

const authLink = setContext((_, { headers }: { headers?: Record<string, string> }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tramites: {
            merge: false,
          },
          titulos: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export function ApolloProvider({ children }: { readonly children: ReactNode }) {
  return (
    <BaseApolloProvider client={apolloClient}>
      {children}
    </BaseApolloProvider>
  );
}

