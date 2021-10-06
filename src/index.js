import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { QueryClientProvider, QueryClient } from 'react-query'

const client = new QueryClient({
  defaultOptions: { queries: { suspense: true } }
})

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Suspense fallback='Loading...'>
        <App />
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
