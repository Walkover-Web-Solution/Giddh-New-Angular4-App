
// Replace chart.js imports with specific components:

// OLD (loads entire Chart.js):
import Chart from 'chart.js';

// NEW (tree-shakable):
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

// Only register components you actually use
