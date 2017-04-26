# Circuit Simulator

Circuit simulator built using **Angular2** and **Snap**

# Test Runninng app

Link: [rc2202.github.io/circuit-simulator/](c2202.github.io/circuit-simulator/)


### Quick start

```bash
# clone our repo
$ git clone https://github.com/RC2202/circuit-simulator.git my-app

# change directory to your app
$ cd my-app

# install the dependencies with npm
$ npm install

# start the server
$ npm start
```
go to [http://localhost:8080](http://localhost:8080) in your browser.



# Getting Started

## Dependencies

What you need to run this app:
* `node` and `npm` (Use [NVM](https://github.com/creationix/nvm))
* Ensure you're running Node (`v6.x.x`+) and NPM (`3.x.x`+)

## Installing

* `fork` this repo
* `clone` your fork
* `npm install` to install all dependencies

## Developing

After you have installed all dependencies you can now start developing with:

* `npm start`

It will start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The application can be checked at `http://localhost:8080`.

As an alternative, you can work using Hot Module Replacement (HMR):

* `npm run start:hmr`

And you are all set! You can now modify your components on the fly without having to reload the entire page.

## Testing

#### 1. Unit Tests

* single run: `npm test`
* live mode (TDD style): `npm run test-watch`

#### 2. End-to-End Tests (aka. e2e, integration)

* single run:
  * in a tab, *if not already running!*: `npm start`
  * in a new tab: `npm run webdriver-start`
  * in another new tab: `npm run e2e`
* interactive mode:
  * instead of the last command above, you can run: `npm run e2e-live`
  * when debugging or first writing test suites, you may find it helpful to try out Protractor commands without starting up the entire test suite. You can do this with the element explorer.
  * you can learn more about [Protractor Interactive Mode here](https://github.com/angular/protractor/blob/master/docs/debugging.md#testing-out-protractor-interactively)

## Production

To build your application, run:

* `npm run build`

You can now go to `/dist` and deploy that to your server!


##How to use?

* Click on the element to get it on canvas
* Drag them to position them according to requirement
* To rotate an element, select it and click on rotate button


##Note:

* Only **Vdc** and **R** is functional now
* Graph is not linked yet
* Only current through elements can be found
* Node voltage is yet to be implemented
* Ground  is not yet implemented



