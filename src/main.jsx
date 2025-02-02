import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './router.jsx'
import '../app/globals.css'
import './scss/index.scss'
import {BrowserRouter} from 'react-router-dom'
import store from './redux/store';
import {Provider} from "react-redux";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
)
