# Nasazení na GitHub Pages

Tento dokument obsahuje instrukce pro nasazení Trading Dashboard aplikace na GitHub Pages.

## Automatické nasazení pomocí GitHub Actions

Projekt je nakonfigurován pro automatické nasazení na GitHub Pages pomocí GitHub Actions. Když nahraješ změny do hlavní větve (main/master), GitHub Actions automaticky vytvoří build a nasadí aplikaci.

### Kroky pro nastavení

1. Nahraj repozitář na GitHub:
   ```bash
   git remote add origin https://github.com/tvoje-username/tradindBoard.git
   git push -u origin main
   ```

2. V nastavení repozitáře na GitHubu (Settings → Pages):
   - Jako "Source" vyber "GitHub Actions"
   - Počkej, až se dokončí první workflow

3. (Volitelné) Nastav API klíče jako tajné proměnné:
   - Jdi do Settings → Secrets and variables → Actions
   - Přidej následující tajné proměnné:
     - `COINGECKO_API_KEY`
     - `ALPHAVANTAGE_API_KEY`
     - `NEWSAPI_API_KEY`
     - `CRYPTOCOMPARE_API_KEY`

4. Po úspěšném nasazení bude tvoje aplikace dostupná na:
   ```
   https://tvoje-username.github.io/tradindBoard/
   ```

## Testování buildu lokálně

Před nahráním změn na GitHub můžeš otestovat build lokálně pomocí přiloženého skriptu:

```bash
./test-build.sh
```

Tento skript vytvoří build adresář a spustí lokální server, který simuluje prostředí GitHub Pages.

## Řešení problémů

### Problémy s cestami k souborům

Aplikace obsahuje speciální skripty, které automaticky upravují cesty k souborům podle toho, zda je spuštěna lokálně nebo na GitHub Pages. Pokud se objeví problémy s načítáním souborů:

1. Zkontroluj konzoli prohlížeče pro chybové zprávy
2. Ověř, že všechny cesty v HTML souborech používají relativní cesty
3. Ujisti se, že skript pro detekci GitHub Pages funguje správně

### Problémy s API

Některá API mohou mít omezení pro cross-origin požadavky. Pokud se objeví CORS chyby:

1. Zkontroluj, zda API podporuje požadavky z GitHub Pages (*.github.io)
2. Zvažte použití proxy serveru nebo alternativního API
3. Pro testovací účely můžeš přepnout na dummy data pomocí tlačítka v administraci

## Vlastní doména

Pokud chceš použít vlastní doménu místo github.io:

1. V nastavení repozitáře (Settings → Pages → Custom domain) zadej svou doménu
2. Vytvoř CNAME záznam u svého poskytovatele domény
3. Uprav detekci GitHub Pages v kódu:

```javascript
// V public/index.html
const isGitHubPages = window.location.hostname.includes('github.io') || 
                      window.location.hostname === 'tva-domena.com';
```
