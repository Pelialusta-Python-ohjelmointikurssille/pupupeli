### Uuden Entityn lisääminen

1. Luo luokka **entities/** kansioon.
Voit halutessasi laajentaa GraphicsEntity-luokkaa, jos haluat yleiskäyttöisen graafisen Entityn.
Laajenna PawnEntity-luokkaa niille Entityille, joiden tulisi seurata ruudukkoa.

    **Kaikki Entityt on johdettava GraphicsEntity-luokasta**

2. Luo factory function **entities/factories/**-hakemistoon. Tällä hetkellä kaikki ovat sijoitettuna tiedostoon **entities/factories/entity_factories.js**.

3. Rekisteröi factory function tiedostoon **manifests/entity_manifest.js**. Factory functionin lisäksi tulisi antaa typeName, jota käytetään, kun GraphicsHandler-luokan createEntity-metodia kutsutaan.

4. Jos haluat Entitylle graafisia elementtejä, sinun on myös luotava sille Skinit, yksi jokaiselle olemassa olevalle teemalle. Katso lisätietoja uusien skinien lisäämisestä.

### Uuden animaation lisääminen

1. Luo luokka **animations/** kansioon.

2. Luo factory function **animations/factories/**-hakemistoon. Tällä hetkellä kaikki on sijoitettuna tiedostoon **animations/factories/animation_factories.js**.

3. Rekisteröi factory function tiedostoon **manifests/animation_manifest.js**. Factory functionin lisäksi tulisi antaa typeName, jolla määritetään toistettava animaatio. Yhteensopivien Entitien luettelossa määritellään kaikki entiteetit, jotka voivat toistaa animaation. Tyhjä lista tarkoittaa, että kaikki entiteetit voivat toistaa sen.

### Adding a new Skin

1. Create a factory function in **entity_skins/factories/**. Currently all are located in **entity_skins/factories/entity_skin_factories.js**.

2. Register the factory function in **manifests/skin_manifest.js**. Along with the factory function you should give a typeName, which is is used to refer to the skin. Along with it you should define a theme, used when a user switches between themes. For example, currently the two themes are "bunny" and "robot".

3. Register skins that are used on a same type of object in SKIN_BUNDLES in **skin_manifest.js**. This is used when creating an entity.
