# Uusien objektien lisääminen peliin

## Lisää uudenlainen objekti

Lisää editor.html:ssä getImage funktion sisällä uusi case-arvo
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
                default:
                    return '<img src="/src/static/game_assets/backgrounds/background_grass.png"></img>';
            }
        }
```
Muista asettaa var _maxImageIndex arvo yhden suuremmaksi, vastaamaan uutta suurinta arvoa switch statementissa.

Kuvat vaihtuvat case-numeroiden mukaan. Ruoho on alustettu arvolla 1 ja pelaaja on alustettu arvolla 0. 
Näitä samoja arvoja käytetään taulukossa joka luodaan json-tiedostoon. Pelilogiikka lukee sitä taulukkoa luodakseen peliruudukon.

Mene gridfactory.js tiedostoon, lisää gridObjectManifest vakiomuuttujaan objetkin arvo, joka vastaa case arvoa
editor.html:ssä. Huom! muista käyttää Constants. - muotoa. 

Luo uusi vakiomuuttuja commonstrings.js tiedostoon. Luo geneerinen nimi ja jos kuva muuttuu teeman mukaisesti voi antaa teeman mukaisia nimiä.
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
