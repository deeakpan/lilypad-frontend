import { ThirdwebProvider } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";

// Initialize QueryClient
const queryClient = new QueryClient();
const activeChain = "ethereum";

function MyApp({ Component, pageProps }) {
  return (
    // Wrap with QueryClientProvider and ThirdwebProvider
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider activeChain={activeChain}>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
