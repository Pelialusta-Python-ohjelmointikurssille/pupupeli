Aseta index.html tiedostossa dropdown-menuun uuden teeman hahmon nimi
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
Lisää game.js tiedostossa setTheme funktioon uusi teema. Aseta teeman nimeksi uuden hahmon mukainen nimi. 

entity_skin_factories: luo uudet funktiot uusille objekteille. Lisää uusi entity type commonstringsistä

skin_manifest: ENTITY SKINS sanakirjaan uusi typeName, uusi theme ja factoryFunctioniin luodun funktion nimi entity_skin_factoriesista