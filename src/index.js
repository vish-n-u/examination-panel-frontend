import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Register from './pages/register';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/login';
import { store } from './store/store'
import { Provider } from 'react-redux'
import Teacher from './pages/teacher';
import Admin from './pages/admin';
import Student from './pages/student';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:"/login",
    element:<Login/>
  }
  ,{
    path:"/register",
    element :<Register/>
  },{
    path:"/teacher/:id",
    element:<Teacher/>
  }
  ,
  {
    path:"/admin/:id",
    element:<Admin/>
  },{
    path:"/student/:id",
    element:<Student/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <RouterProvider router={router} />
  </Provider>
);