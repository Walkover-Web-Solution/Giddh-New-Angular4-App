// Polyfills
// (these modules are what are in 'angular2/bundles/angular2-polyfills' so don't use that here)

// import 'ie-shim'; // Internet Explorer
import 'es6-shim';
import 'es6-promise';
import 'es7-reflect-metadata';
import 'zone.js/dist/zone-microtask';

if ('production' === ENV) {
  // Production


} else {
  // Development or Testing

  Error['stackTraceLimit'] = Infinity;

  require('zone.js/dist/long-stack-trace-zone');

}
