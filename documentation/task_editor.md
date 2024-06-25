# Tasoeditorin käyttäjäopas 

Sovelluksen mukana tulevalla tasoeditorilla voit helposti luoda uusia tehtäviä ja haasteita käyttäjien ratkottavaksi. Editoriin pääset osoitteesta [pupupeliroot]/editor.html (kh. muuta osoite oikeaksi, kun julkaistaan verkkoon). 

## Uuden tason lisääminen 

Kaikki tehtävät luetaan sovelluksen juurihakemiston 'tasks' kansiosta. Tämän kansion sisällä on kansiot jokaiselle tehtäväsarjalle, jotka sisältävät tehtäväsarjan sisältämät tehtävätiedostot. 

(nyt) Tehtäväsarja kansiot tulee nimetä numerojärjestyksessä 1,2,3,...,n sovelluksen tämänhetkisen toiminnallisuuden vuoksi. Sama koskee myös kansioiden sisältämiä tehtävätiedostoja, jotka tulee myös nimetä järjestyksessä 1.json, 2.json, 3.json, ..., n.json. Tehtäväsarjat ja tehtävät esitetään sovelluksessa myös tässä samassa numerojärjestyksessä. 

(tulevaisuudessa) 'tasks' kansiossa on tiedosto tasks.json tiedosto, joka sisältää kaikkien tehtäväsarjojen ja tehtävien nimet. Nimet on listattu järjestyksessä, jossa ne halutaan sovelluksessa esittää. Kun lisäät uuden tehtävän/tehtäväsarja, tulee sen nimi lisätä tasks.json tiedostoon halutun sijainnin mukaiseen paikkaan, sekä itse tehtävätiedosto lisätä tehtäväsarjan mukaiseen kansioon. Tehtäväsarjojen ja tehtävien nimeäminen on täysin käyttäjän päätettävissä, mutta nimen tulee vastata tasks.json tiedostossa määriteltyä nimeä. 

### Esimerkki tasks.json rakenteesta: 

``` 
{ 
"chapters": [ 
tehtäväsarja1nimi,  
tehtäväsarja2nimi,  
tehtäväsarja3nimi,  
...,  
tehtäväsarjaNnimi 
], 
"chapter1tasks": [ 
task1nimi,  
task2nimi,  
task3nimi,  
...,  
taskNnimi
], 
"chapter2tasks": [ 
task1nimi,  
task2nimi,  
task3nimi,  
...,  
taskNnimi 
], 
"chapter3tasks": [ 
task1nimi,  
task2nimi,  
task3nimi,  
...,  
taskNnimi 
], 
...
... 
... 
"chapterNtasks": [ 
task1nimi,  
task2nimi,  
task3nimi,  
...,  
taskNnimi 
]
} 
``` 

## Editorin perusnäkymä 

**Ruudukon leveys/korkeus:** Näistä voit valita tehtävän ruudukon mitat. Toiminnallisesti suositellut enimmäisarvot ovat 50x50. Tästä suuremmat koot saattavat aiheuttaa graafisia häiriöitä.  

**Luo ruudukko** painike hyväksyy leveys ja korkeus kenttiin annetut arvot ja luo määritellyn kokoisen ruudukon sivun vasemman puolen alaosaan. 

**Tulosta taso** painike lukee tasoeditorin kenttiin annetut arvot ja tulostaa kentän lähdekoodin JSON muodossa sivun oikealle puoliskolle, joka voidaan kopioida sellaisenaan tehtävätiedostoon. Lue tarkemmat tiedot uuden tehtävän lisäämisestä omasta osiosta, jos tarvitset opastusta tässä. 

**Tallenna** painike lataa sivun oikeassa puoliskossa näkyvää lähdekoodia vastaavan tehtävätiedoston tietokoneellesi. 

**Import** painikkeen avulla voit ladata olemassa olevan tehtävätiedoston tiedot editorinäkymään. Painiketta painettaessa aukeaa kansionäkymä, josta voit valita haluamasi tehtävätiedoston. Kun avaat tiedoston tehtävän lähdekoodi ilmestyy sivun oikeaan puoliskoon ja kentät sivun vasemmalla puolella täytetään kentän tietoja vastaavilla tiedoilla. 

**Tehtävän nimi** kenttä asettaa sovelluksen sisällä näkyvän tehtävän nimen tehtävänäkymän yläreunaan. *Huom*. Tehtävän nimi ei tarvitse olla sama kuin tehtävätiedoston nimi, eikä ole millään tavalla kytköksissä tähän. 

**Tehtävän tyyppi** valinta päättää minkälainen tehtävän näkymä on ja mitä läpäisytavoitteita tehtävässä on.  
Valinnat ovat: 
- Kerää esineet. Tässä tehtävätyypissä tavoite on kerätä kaikki kerättävät esineet kentältä ja tämä läpäisee tason 
- Monivalinta. Tässä tehtävätyypissä käyttäjälle annetaan monivalinta kysymys ja tähän oikean vaihtoehdon valitsemalla käyttäjä läpäisee tason. 
- Ohjeistus. Tämä tyyppi on tarkoitettu ohjeistus "tehtävän" tekoon. Tämä eroaa muista vaihtoehdoista sillä että tässä tehtävätyypissä käyttäjä ei näe pelikenttää eikä editoria. Tämä tehtävätyyppi myös editori näkymä vaihtuu antamaan suuremman tekstilaatikon ohjeistuksen kirjoitusta varten. Tässä kentässä voi käyttää markdown syntaksia tekstin muotoiluun sovelluksen näkymässä. Tämä tehtävätyypin tehtävät merkataan läpäistyksi, kun käyttäjä avaa tehtävän ensimmäistä kertaa. 

**Esineiden lisääminen ja poistaminen** valinta asettaa voiko käyttäjä kyseisessä tasossa käyttää käskyjä luo() ja poista() kentällä olevien esineiden luomiseen tai poistamiseen. 

**Valitse muut ehdot** valinnoista voi määrittää ylimääräisiä läpäisyvaatimuksia kenttään tehtävätyyppi valinnan lisäksi (toimii tällä hetkellä vain kerää eineet tyyppisessä tehtävässä). Jos läpäisyvaatimus on valittu, näkyy painike tummana. Valinnat ovat: 
- Käytä while-silmukkaa. Vaatii että tehtävän ratkaisussa käytetyssä koodissa on käytetty vähintään yhtä ´while´ komentoa. 
- Käytä for-silmukkaa. Vaatii että tehtävän ratkaisussa käytetyssä koodissa on käytetty vähintään yhtä ´for´ komentoa. 
- Käytä input(). Vaatii että tehtävän ratkaisussa käytetyssä koodissa on käytetty vähintään yhtä ´input()´ komentoa. Tämä kriteeri täyttyy myös käyttäessä pupu.kysy() komentoa koska tämä myös käyttää input komentoa. 
- Vastaus enintään * riviä. Annetun vastauksen rivimäärän tulee olla pienempi tai yhtä suuri kuin tämä arvo. (Ominaisuus ei toimi tekstin kirjoitushetkellä) 

**Tehtävän kuvaus/Editorin koodi/Monivalintatehtävä** painikkeista voit valita mitä ominaisuutta haluat muokata. **Huom!** Tehtävän kuvaus sekä editorin koodi kentissä sana 'hahmo' korvataan käytetyn teeman hahmoa vastaavalla sanalla (pupu, robo). Käytä siis sanaa hahmo ainakin editorin koodia kirjoittaessa, tyyliin hahmo.liiku("oikea"). Tämä korvaantuu teeman mukaan käskyllä pupu.liiku("oikea") tai robo.liiku("oikea). 
- Tehtävän kuvaus. Kirjoita tähän haluamasi tehtävän kuvaus. Tehtävän kuvaus näkyy sovelluksen tehtävänäkymässä tehtävän nimen ja editorin välisellä alueella. Tähän kenttään hyvä kirjoittaa tehtävän anto sekä vinkkejä tehtävän ratkaisemiseen. 
- Editorin koodi. Kirjoita tähän koodi, jonka haluat tehtävänäkymän editorissa näkyvän tehtävä ladattaessa. Kentässä ei toimi askelvaihto, joten käytä neljää välilyöntiä sisennyksen merkkaamiseen. 
- Monivalintatehtävät. Lisää vastausvaihtoehto painamalla + painiketta. Voit poistaa viimeisen vastausvaihtoehdon painamalla x painiketta. Kirjoita haluamasi vastaus vaihtoehto laatikoihin ja merkkaa näistä yksi tai useampi oikeaksi vastaukseksi. Suositeltu vastausten kokonaismäärä on 4kpl. 

**Tehtävän ruudukko** osassa näkyy sivun alussa määritellyn kokoinen ruudukko tehtävän kentän rakentamiseksi. Ruuduissa olevaa asiaa voi vaihtaa klikkaamalla ruutua hiiren vasemmalla painikkeella (porkkana->kivi->tyhjä->porkkana...). Hiiren oikealla painikkeella voit asettaa pelaajahahmon aloituspaikan. Taso esitetään lähdekoodissa matriisina jossa:  
- 0 = pelaaja aloitus sijainti 
- 1 = tyhjä ruutu 
- 2 = kerättävä esine 
- 3 = este 

## Esimerkki tehtävätiedoston muodosta 

```
{
"title": "Esimerkkitehtävä", 
"taskType": "multiple-choice", 
"enableAddRemove": true, 
"description": [ 
"Tämä on esimerkkitehtävän tehtävän kuvaus.", 
"", 
"Monivalintatehtävän kysymys:", 
"Mikä on keskimäärin läpimin vuodenaika?" 
], 
"editorCode": [ 
"päivä = input(Millainen päivä sinulla on?\")", 
"if päivä == \"hyvä\":", 
" print(\"Hyvää päivää!)", 
"else:", 
" print(\"Päivää!\")" 
],
"multipleChoiceQuestions": [ 
{
"question": "Kevät", 
"isCorrectAnswer": false 
},
{
"question": "Kesä", 
"isCorrectAnswer": true 
}, 
{
"question": "Syksy", 
"isCorrectAnswer": false 
}, 
{ 
"question": "Talvi", 
"isCorrectAnswer": false 
} 
], 
"grid": [
[0,1,3,1,2,1,1,1], 
[1,1,3,1,1,1,1,1], 
[1,1,3,1,1,1,1,1], 
[1,1,1,1,1,1,1,1], 
[1,1,1,1,1,1,1,1], 
[1,1,1,1,1,1,1,1], 
[1,1,1,1,1,1,1,1], 
[1,1,1,1,1,1,1,1] 
], 
"conditions": [ 
{ 
"condition": "conditionUsedWhile", 
"parameter": true 
}, 
{ 
"condition": "conditionUsedFor", 
"parameter": false 
}, 
{ 
"condition": "conditionUsedInput", 
"parameter": false 
}, 
{ 
"condition": "conditionMaxLines", 
"parameter": false 
} 
] 
} 
``` 
 