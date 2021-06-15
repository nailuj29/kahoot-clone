import React from 'react';
import { AppProps } from 'next/app';
import Link from "next/link"
import './styles.css';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Link href="/">
        <h1 className="text-center text-4xl font-semibold border-b-2 border-gray-300 pb-1 cursor-pointer">
          [INSERT NAME AND BANNER HERE]
        </h1>
      </Link>
      <main>
        <Component {...pageProps} />
      </main>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default CustomApp;
