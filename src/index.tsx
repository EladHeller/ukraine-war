import { createRoot } from 'react-dom/client';
import Home from './Home';

const root = document.getElementById('root');

if (root) {
  const render = createRoot(root);
  render.render(<Home />);
}
