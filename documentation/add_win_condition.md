## Voittoehtojen tyypit
Voittoehtojen tyypit voi jakaa karkeasti neljään luokkaan:
- Ehto, joka vaatii että käytetään jotain pythonin sisäänrakennettua toimintoa (esim. for-loopin käyttö)
- Ehto, joka lukee käyttäjän syöttämää koodia ja tarkistaa siitä jotain (esim. rivien määrä, samanarvoisuus)
- Ehto, joka tarkistaa jotain pelin sisäisesti (esim. että kaikki porkkanat on kerätty)
- Ehto, joka tarkistaa, että monivalintatehtävään annettu vastaus on oikein

## Voittoehdon lisääminen
Uutta voittoehtoa lisättäessä pitää tietää, minkälaista ehtoa on lisäämässä. Muokattavat funktiot riippuvat siitä, missä tarkastus tehdään.
- Ensimmäistä edellämainittua ehtotyyppiä lisätessä pitää:
    1. Lisätä `src/python/pelaaja.py` -tiedostoon muita olemassaolevia tarkistusmetodeja vastaava metodi, joka hoitaa varsinaisen tarkistamisen. [ast](https://docs.python.org/3/library/ast.html) dokumentaation lukemisesta voi olla tässä hyötyä.
    2. Lisätä `src/input/worker.js` -tiedostoon checkClearedConditions-funktioon muita tarkastuksia muistuttava koodinpätkä
    3. Mahdollisesti lisätä `src/clear_conditions.js` -tiedostoon conditionChecker-funktioon koodia hoitamaan uuden ehdon tarkistus
- Toista edellämainittua ehtotyyppiä lisätessä pitää:
    1. Lisätä `src/input/worker.js` -tiedostoon checkClearedConditions-funktioon tarkastuksen hoitava koodinpätkä
    2. Mahdollisesti lisätä `src/clear_conditions.js` -tiedostoon conditionChecker-funktioon koodia hoitamaan uuden ehdon tarkistus
- Kolmatta edellämainittua ehtotyyppiä lisätessä pitää:
    1. Ei helppoa tapaa määritellä mitä tulisi muuttaa; riippuu liikaa ehdon yksityiskohdista. Mahdollisesti ainakin syytä päivittää jotain globaalia muuttujaa pelilogiikkaa suorittaessa.
- Neljäs ehtotyyppi on erikoistapaus, joka on jo lisätty

## Lisäksi
- Editoriin on syytä tehdä ehdon lisääminen jo mielusti ennen kuin sen toteuttaa pelin koodiin.
- Myös importin olisi syytä toimia editorissa.
- Nämä hoituvat todennäköisesti olemassaolevaa editorin koodia kopioimalla ja hieman muokkaamalla.