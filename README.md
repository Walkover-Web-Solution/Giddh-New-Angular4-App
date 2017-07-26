# README

The following is a quick guide to preparing the internal 'Giddh' web
application.

Prerequisites
-------------
**What you need to run this app:**
* Ensure you're running the latest versions Node `v6.x.x`+ (or `v7.x.x`) and NPM `3.x.x`+
* `node` and `npm` (`brew install node`)
* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)
* `typescript` (`npm install --global typescript`)

Following environment variable(s) need to be set in hosts file:
0. `127.0.0.1       localapp.giddh.com`

## Installing
* `npm install webpack-dev-server rimraf webpack -g` to install required global dependencies
* `npm install` to install all dependencies
* `npm run start` to start the dev server

## Running the app
After you have installed all dependencies you can now run the app. Run `npm run start` to start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://localhost:3000/`.

### server
```bash
# development
npm run server
# production
npm run build:prod
npm run server:prod
```

## Other commands

### build files
```bash
# development
npm run build:dev
# production (jit)
npm run build:prod
# AoT
npm run build:aot
```

# Configuration
Configuration files live in `config/` we are currently using webpack, karma, and protractor for different stages of your application

___

enjoy — **GIDDH TEAM**
