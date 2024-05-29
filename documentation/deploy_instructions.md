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

First, run the following in the git root to generate a self-signed certificate (for https):

~~~
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
~~~

Then, start a webserver from root folder using:

~~~
python3 server.py
~~~

This is done because of CORS policy requirements on the server side. Webworkers won't work properly otherwise.
Since it uses a self-signed certificate, the browser will warn you before you enter the page.

## OpenShift deployment

The Httpd option works for running on OpenShift.
