## Lintin ja testien suorittaminen

Asenna ensin npm-paketit:
~~~
npm install
~~~

Suorita testit:
~~~
npm test
~~~

Suorita lint:
~~~
npm run lint
~~~

## Suorita paikallisesti

Käynnistä verkkopalvelin juurikansiosta komennolla:

~~~
python3 server.py
~~~

Tämä tehdään palvelinpuolen CORS-käytäntövaatimusten vuoksi. Webworkerit eivät muuten toimi kunnolla.

## Suorita paikallisesti HTTPS:llä

Suorita ensin seuraava komento git-juuressa luodaksesi itse allekirjoitettu varmenne (https:lle):

~~~
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
~~~

Käynnistä sitten verkkopalvelin juurikansiosta käyttämällä:

~~~
python3 server_https.py
~~~

Koska selain käyttää itse allekirjoitettua varmennetta, saat varoituksen ennen kuin siirryt sivulle.

## OpenShift-käyttöönotto

Httpd-vaihtoehto toimii OpenShift-tilassa.
