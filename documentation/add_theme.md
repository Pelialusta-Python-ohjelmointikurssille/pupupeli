## Teemojen lisääminen

- Aseta index.html tiedostossa dropdown-menuun uuden teeman hahmon nimi
```
<div id="toggle-buttons-div">
                            <select id="theme-select" type="button">
                                <option>Pupu</option>
                                <option>Robo</option>
                                <!-- Add new themes here to add them to dropdown! -->
                            </select>
                            <button id="trail-toggle-button" type="button">Jälkiviiva</button>
                            <button id="grid-toggle-button" type="button">Ruudukko</button>
                        </div>
```
- Aseta uuden teeman kuvat static/game_assets kansioon. Lisää kuvat eri kansioihin kuvan tyypin mukaisesti.

- Mene asset_manifestiin ja lisää kuville alias-nimet sekä osoitteet kansiorakenteen mukaan. 

- Lisää game.js tiedostossa setTheme funktioon uusi teema. Aseta teeman nimeksi uuden hahmon mukainen nimi. 

- entity_skin_factories: luo uudet funktiot uusille objekteille.

- skin_manifest: ENTITY SKINS sanakirjaan uusi typeName, uusi theme ja factoryFunctioniin luodun funktion nimi entity_skin_factoriesista. Lisää myös SKIN BUNDLES sanakirjaan avaimia vastaavat nimet, jotka ovat typeName:n mukaiset.
