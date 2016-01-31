# NODE-OPTICS
Optic fibre network simulator built with node.js.


* Install dependencies and run server
```sh
npm install
node server.js

```
* Open in browser
```sh
http://localhost:8081/

```


* Requires NODE v5.0.0+

## Overview
* WebApp will be hosted online.
* User will create a circuit using the clientside UI only then when circuit is ran pass the instance of the circuit as JSON to the server which does calculations and returns result.
* User can save a code that the server generates when writing that particular ciruit to a database (as JSON).
* User can use codes to fetch the circuit from the server (returned as JSON).
* Frontend technology undecided.

## TODO
* Fix backend model and have it pass all tests
* Implement a json export <-> import function on the server (replaces simulator.js).
* Design and implement the clientside.
