# Uusien objektien lisääminen peliin

## Keräilyesineiden tai esteiden lisääminen

Lisää haluamasi objekti listaan, joka löytyy commonstrings.js tiedostosta:
```
const COLLECTIBLE_ALIASES = ["porkkana", "jakoavain", "ruoka"];

const OBSTACLE_ALIASES = ["kivi", "viemäri", "este"];
```
lisää objektin kuvat kansioon static, game_assets, collectibles/obstacles

## Lisää uudenlainen objekti

luo uusi constant commonstrings.js

luo geneerinen nimi ja jos kuva muuttuu teeman mukaisesti voi antaa teeman mukaisia nimiä

Lisää editor.html:ssä createTable  funktion sisällä uusi case-arvo
```
 cell.addEventListener('click', function () {
                        switch (this.dataset.value) {
                            case '1':
                                this.dataset.value = '2';
                                this.innerHTML = '<img src="/src/static/game_assets/collectibles/carrot.png"></img>'
                                break;
                            case '2':
                                this.dataset.value = '3';
                                this.innerHTML = '<img src="/src/static/game_assets/obstacles/rock.png"></img>'
                                break;
                            case '3':
                                this.innerHTML = '<img src="/src/static/game_assets/backgrounds/background_grass.png"></img>'
                                this.dataset.value = '1';
                                break;
                        }

                    });
```
this.dataset.value tulee muuttua niin, että arvoksi muuttuu aina seuraavalla klikkauksella halutun kuvan arvo.

