<p align="center">
  <img src="https://res.cloudinary.com/angularclass/image/upload/v1431925418/webpackAndangular2_dwhus9.png" alt="Webpack and Angular 2" width="500px;" height="320px;"/>
</p>

# Angular2 Webpack Starter [![Join the chat at https://gitter.im/angular-class/angular2-webpack-starter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/angular-class/angular2-webpack-starter?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> A starter kit featuring [Angular 2](https://angular.io), [Router](https://angular.io/docs/js/latest/api/router/), [TypeScript](http://www.typescriptlang.org/), and [Webpack](http://webpack.github.io/) by [AngularClass](https://angularclass.com).
If you're looking for Angular 1.x please use [NG6-starter](https://github.com/angular-class/NG6-starter)

This repo serves as an extremely minmal starter for anyone looking to get up and running with Angular 2 and TypeScript. Using a [Webpack](http://webpack.github.io/) for building our files and assiting with boilerplate.
* Best practice in file organization for Angular
* Ready to go build system for working with TypeScript

### Quick start
> Edit `app.ts` inside `/src/components/app.ts`

```bash
$ npm start
```


## File Structure
We use the component approach in our starter. This is the new standard for developing Angular apps and a great way to ensure maintainable code by encapsulation of our behavior logic. A component is basically a self contained app usually in a single file or a folder with each concern as a file: style, template, specs, e2e, and component class. Here's how it looks:
```
src
--public/ * static assets are served here
----lib/ * static libraries
------traceur.min.js * ignore this file for now as it's required by Angular 2
----favicon.ico * replace me with your own favicon.ico
----index.html * where we place our script tags
--app/
----bootstrap.js * entry file for app
----components/ * where most of components live
------app.js * entry file for components
------home/ * home component
--------home.js * home entry file
--------home.component.js * directive for home
--------home.css * styles for home
--------home.html * template for home
--------home.spec.js * specs for home
--------home.e2e.js * e2e for home
----common/ * where common files that are used throughout our app
----custom_typings/ * where we define our custom types
------ng2.d.ts * where we patch angular2 types with our own until it's fixed
--typings/ * where tsd defines it's types definitions
--tsconfig.json * config that webpack uses for typescript
--tsd.json * config that tsd uses for managing it's definitions
--package.json * what npm uses to manage it's dependencies
--webpack.config.js * our webpack config
```

# Getting Started
## Dependencies
What you need to run this app:
* `node` and `npm` 
Once you have those, you should install these globals with `npm i -g`:
* `webpack`
## Installing
* `fork` me
* `clone` your fork
* `npm install` to install all dependencies

## Running the app
After you have installed all dependencies you can now run the app. Run `npm server` to start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://localhost:8080`.
 
### server
```bash
$ npm run server
```

### build files
```bash
$ npm run build
```

### watch and build files
```bash
$ npm run watch
```

# TypeScript
> To take full advantage of TypeScript with autocomplete you would have to install it globally and use an editor with the correct TypeScript plugins.

## Use latest TypeScript compiler
TypeScript 1.5 beta includes everything you need. Make sure to upgrade, even if you installed TypeScript previously.

    $ npm install -global typescript@^1.5.0-beta

## .d.ts Typings
The typings in `typings/` are partially autogenerated, partially hand
written. All the symbols should be present, but probably have wrong paramaters
and missing members. Modify them as you go.

    $ npm install -global tsd
 > You may need to require `reference path` for your editor to autocomplete correctly
 ```
 /// <reference path="../../typings/tsd.d.ts" />
 /// <reference path="../custom_typings/ng2.d.ts" />
 ```
 Otherwise including them in `tsd.json` is prefered 

## Use a TypeScript-aware editor
We have good experience using these editors:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Webstorm 10](https://www.jetbrains.com/webstorm/download/)
* [Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/atom-typescript)
* [Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)


### Todo
* hot-component-reloading

# Starter Kit Support and Questions
> Contact us anytime for anything about this repo

* [Gitter: angular-class/angular2-webpack-starter](https://gitter.im/angular-class/angular2-webpack-starter)
* [Twitter: @AngularClass](https://twitter.com/AngularClass)

___

enjoy -- **AngularClass** 

<br><br>

[![AngularClass](https://angularclass.com/images/ng-crown.svg  "Angular Class")](https://angularclass.com)
##[AngularClass](https://angularclass.com)
> Learn Angular in 2 days from the best
