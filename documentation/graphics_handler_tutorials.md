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

### Uuden Skinin lisääminen

1. Luo factory function **entity_skins/factories/**-hakemistoon. Tällä hetkellä kaikki sijaitsevat tiedostossa **entity_skins/factories/entity_skin_factories.js**.

2. Rekisteröi factory function tiedostoon **manifests/skin_manifest.js**. Factory functionin lisäksi tulisi antaa typeName, jota käytetään Skiniin viittaamiseen. Sen lisäksi sinun tulee määrittää teema, jota käytetään, kun käyttäjä vaihtaa teemojen välillä. Esimerkiksi tällä hetkellä kaksi teemaa ovat "bunny" ja "robot".

3. Rekisteröi Skinit, joita käytetään samantyyppisissä objekteissa SKIN_BUNDLES-tiedostossa **skin_manifest.js**:ssa. Tätä käytetään Entityä luotaessa.
