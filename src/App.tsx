import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './Routes';
import './App.css'
import { useSignalREvents } from './Hooks/useSignalREvents';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient, 
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const token = localStorage.getItem("token") ?? "";
  useSignalREvents(token);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
