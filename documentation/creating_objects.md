# Uusien objektien lisääminen peliin

## Lisää uudenlainen objekti

- Mene kansioon static/game_assets. Luo uusi kansio, jonka nimi vastaa uudenlaista objektia. Lisää kuva tämän luodun kansion sisään.

- Lisää editor.html:ssä getImage funktion sisällä uusi case-arvo
```
function getImage(index) {
            //Player is 0, grass is 1 and is used as the default
            switch (index) {
                case '0':
                    return '<img src="/src/static/game_assets/characters/bunny_right.png"></img>';
                case '2':
                    return '<img src="/src/static/game_assets/collectibles/carrot.png"></img>';
                case '3':
                    return '<img src="/src/static/game_assets/obstacles/rock.png"></img>';
                //Lisää tähän uusi case
                default:
                    return '<img src="/src/static/game_assets/backgrounds/background_grass.png"></img>';
            }
        }
```
- Muista asettaa var _maxImageIndex arvo yhden suuremmaksi(löytyy getImage funktion yläpuolelta) vastaamaan uutta suurinta arvoa switch statementissa.

- Kuvat vaihtuvat case-numeroiden mukaan editorissa. Ruoho on alustettu arvolla 1 ja pelaaja on alustettu arvolla 0. Näitä samoja arvoja käytetään taulukossa joka luodaan json-tiedostoon. Pelilogiikka lukee sitä taulukkoa luodakseen peliruudukon.

- Mene gridfactory.js tiedostoon, lisää gridObjectManifest vakiomuuttujaan objetkin arvo, joka vastaa case arvoa
editor.html:ssä. Huom! muista käyttää Constants. - muotoa. 

- Luo uusi vakiomuuttuja commonstrings.js tiedostoon. Luo geneerinen nimi ja, jos kuva muuttuu teeman mukaisesti, voi antaa teeman mukaisia nimiä.

Esimerkki:

```
const gridObjectManifest = {
    0: Constants.PLAYER_STR,
    1: "",
    2: Constants.COLLECTIBLE,
    3: Constants.OBSTACLE,
    4: Constants.QUESTION_COLLECTIBLE
}
```
- siirry src -> game -> graphics_handler -> manifests -> asset_manifest kansioon.

- Lisää objekti assets listaan. Katso että lisäät objektin objektin tyyppiä vastaavaan listaan. Aseta uudelle objektille alias-nimi ja src johon asetetaan kuvan osoite kansiorakenteessa.

- entity_skin_factories: Tee uusi funktio. Jos objektilla on vain yksi kuva, aseta skinOptions sanakirjaan defaultTexture : assets.collectibles.(aliasnimi)

- skin_manifest: aseta entity skins listassa typeName, joka toimii id:nä, teema, jossa skiniä käytetään sekä
factoryFunctioniin asetetaan entity_skin_factories tiedostossa tehdyn funktion nimi.

- Aseta SKIN BUNDLES sanakirjassa avaimeksi Entity.type ja lisää listaan avainta vastaavat typeName-tiedot listaan. 

- entity_factories: luo uusi funktio tai kopio olemassa oleva funktio ja muuta entity.type commonstringsissä olevaksi vastaavaksi typeksi

- Jos haluat, että objekti reagoi pelihahmoon, käy tutkimassa command.js:ää. Sieltä löytyy tarvittavia funktioita pelilogiikan lisäämiseen







