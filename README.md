# NODE-OPTICS
Optic fibre network simulator built with node.js.

* Install node.js

https://nodejs.org/en/

* Install atom editor

https://atom.io/

* Add linters
```sh
apm install linter linter-eslint
```
* Clone the Repo
```sh
git clone https://github.com/lolcookie/node-optics.git
```
* Install dependencies,build and run server
```sh
npm install
npm run build
node server.js
```
* Open in browser
```sh
http://localhost:8081/
```

## Overview
* WebApp will be an online version of the program OPTICS with cloud based saving.

(OPTICS: https://github.com/lolcookie/OPTICS)

## Client

* User will create a circuit using their browser.
* When circuit is ran it will be based as JSON to the server which uses the model to find a result.
* If the computation is successful the clients view will be updated with the results.
* There will be an option for the client to save a short string which represents their circuit saved online.
* Inputing the string will load the clients previous circuit.
* Possibly add a login function so client does not have to remember strings.

## Server

* Server stores all logic and serves the view to the client.
* The server will receive JSON from client which it runs against the model and returns a result.
* If the client saves the server will store the JSON of the circuit to a database and return a unique key.
* If the client loads using a key the server will check the database and return the circuit for that key.

## TODO

### Client
* Design and implement the client view in react.
* Try and use material design.

### Server
* Fix backend model and have it pass all tests.
* Create api/run endpoint which takes a JSON representation of a
circuit and calculates results.
* Create api/load and api/save endpoints with a json file as mock DB.
* Design and implement a database (PostgreSQL)

## Resources

### Project Specifications
* ORIGINAL BRIEF: http://teaching.csse.uwa.edu.au/units/CITS3200/project/offered/Projects_2015/Schediwy_Modelling_Optical_Fibres.html
* OPTICS: https://github.com/lolcookie/OPTICS

### Server
* NODE.JS: https://nodejs.org/api/
* JAVASCRIPT: https://developer.mozilla.org/en-US/docs/Web/JavaScript
* ES6: https://leanpub.com/understandinges6/read
* BABEL-REPL: https://babeljs.io/repl/
* PostgreSQL: tbd
* REDIS: tbd

### Client
* REACT: https://facebook.github.io/react/docs/getting-started.html
* MATERIAL: https://www.google.com/design/spec/material-design/introduction.html
