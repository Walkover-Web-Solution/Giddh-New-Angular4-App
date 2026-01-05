
// Replace full D3 import with specific modules:

// OLD (loads entire D3):
import * as d3 from 'd3';

// NEW (specific modules only):
import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, area } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';

// Update package.json dependencies:
// Remove: "d3": "^7.9.0"
// Add: 
//   "d3-selection": "^3.0.0",
//   "d3-scale": "^4.0.2",
//   "d3-shape": "^3.2.0",
//   "d3-axis": "^3.0.0"
