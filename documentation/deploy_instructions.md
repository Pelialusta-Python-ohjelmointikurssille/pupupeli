## Running linting and tests

First install npm packages:
~~~
npm install
~~~

Run tests:
~~~
npm test
~~~

Run linting:
~~~
npm run lint
~~~

## Run locally

Start a webserver from root folder using:

~~~
python3 server.py
~~~

This is done because of CORS policy requirements on the server side. Webworkers won't work properly otherwise.

## OpenShift deployment

The Httpd option works for running on OpenShift.
