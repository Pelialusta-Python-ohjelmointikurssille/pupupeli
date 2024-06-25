# Käyttäjän opas hahmon hyväksymiin käskyihin

Pelaajan ohjaama hahmo on määritelty python kielen mukaiseksi olioksi ja kaikki käskyt sille välitetään python syntaksin mukaisesti. Riippuen käytössä olevasta teemasta pelaaja olion kutsumanimi muuttuu teeman mukaisesti. Kirjoitushetkellä käytössä on teemat 'pupu' sekä 'robo', joten näillä teemoilla liikkumakutsu kuuluisi pupu.liiku("oikea") tai robo.liiku("oikea"). Teemoja tulee myöhemmin lisää ja niille määritellään omat kutsumat siinä yhteydessä. 

**Huom!** Tässä käyttöohjeessa käytetään teeman mukaisen kutsumanimen sijaan kutsumanimeä 'hahmo'. Kun käytät näitä komentoja korvaa siis sana 'hahmo' teeman mukaisella nimellä.

## Käytössä olevat komennot

### Liiku

**Käyttö:** hahmo.liiku("suunta")

Korvaa suunta halutulla suunnalla. Hyväksytyt suunnat ovat **oikea**, **vasen**, **ylös**, **alas**. Jos funktiolle antaa muun kuin hyväksytyn arvon palauttaa se virheen. (ValueError "Virheellinen suunta")

Tällä käskyllä pelaaja hahmo liikkuu yhden ruudun matkan komennossa määriteltyyn suuntaan.

---

### Sano

**Käyttö:** hahmo.sano("merkkijono")

Korvaa merkkijono halutulla sanalla

Pelaajahahmon viereen ilmestyy puhekupla, jonka sisällä määritelty merkkijono näkyy.

---

### Puhu

**Käyttö:** hahmo.puhu("merkkijono")

Korvaa merkkijono halutulla sanalla

Sama toiminto kuin käskyllä sano.

---

### Kysy

**Käyttö:** hahmo.kysy("merkkijono")

Korvaa merkkijono halutulla kysymyksellä

Hahmosta tulee puhekupla, jossa näkyy annettu merkkijono ja tämän alapuolella syötelaatikko johon käyttäjä voi kirjoittaa vastauksen. Funktio palauttaa syötelaatikkoon annetun arvon.

---

### Laske

**Käyttö:** hahmo.laske("esine")

Korvaa esine halutulla esineellä. Hyväksytyt esineet:
- Kerättävän esineen synonyymit: "porkkana", "jakoavain", "ruoka"
- Esteen synonyymit: "kivi", "viemäri", "este"

Kaikki synonyymit esineelle toimivat ristiin teemasta riippumatta.

Funktio palauttaa esinettä vastaavien objektien määrän kentällä. 

---

### Luo

**Käyttö:** hahmo.luo("esine",x,y)

Korvaa esine halutulla esineellä, sekä x ja y halutuilla koordinaateilla, johon haluat esineen ilmestyvän. Hyväksytyt esineet:
- Kerättävän esineen synonyymit: "porkkana", "jakoavain", "ruoka"
- Esteen synonyymit: "kivi", "viemäri", "este"

Kaikki synonyymit esineelle toimivat ristiin teemasta riippumatta.

Jos kentän asetuksissa on sallittu "esineiden luonti ja poisto" tämä komento luo pyydetyn teeman mukaisen esineen kutsussa määriteltyihin koordinaatteihin kentällä.

---

### Poista

**Käyttö:** hahmo.poista(x,y)

Korvaa x ja y kentältä poistettavan esineen koordinaateilla.

Poistaa annetuissa koordinaateissa olevan esineen.

---

### Rivi

**Käyttö:** hahmo.rivi(numero)

Numero korvataan suoritettavalla rivinumerolla.

Vain pelin toiminnallisuuden käyttöön. Käytetään palauttamaan suoritettava rivinumero, jotta tämä rivi pystytään korostamaan koodia suorittaessa.

---