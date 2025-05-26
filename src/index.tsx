import { createRoot } from 'react-dom/client';
import App from '@/app';

const root = document.getElementById('root');

if (!root) {
	throw new Error();
}

createRoot(root).render(<App />);
