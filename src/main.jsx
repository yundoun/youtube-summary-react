import 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './application/store/rootStore';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
