import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Room from './pages/Room';
import Recording from './pages/Recording';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/room/:id",
    element: <Room />,
  },
  {
    path: "/recording",
    element: <Recording />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
