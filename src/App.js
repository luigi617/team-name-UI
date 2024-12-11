import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Room from './pages/Room';
import Recording from './pages/Recording';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './pages/SignUp';
import CreateStreaming from "./pages/CreateStreaming";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/room/:streamPath",
    element: <Room />,
  },
  {
    path: "/recording",
    element: <Recording />,
  },
  {
    path: "/create-streaming",
    element: <CreateStreaming />,
  }
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
