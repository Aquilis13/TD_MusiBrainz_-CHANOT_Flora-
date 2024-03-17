# Nom
`CHANOT Flora`

# Infos pour la récupération
## En mode dev
```bash
npm install
npm run build
```
👉http://localhot:5173  
Le port peut changer

## En mode build 
Mettre le dossier de build (le dossier dist) dans un serveur web.  
[Dossier dist](https://github.com/Aquilis13/TD_MusiBrainz_-CHANOT_Flora-/tree/main/dist)

Si le fichier n'est pas à la racine du serveur il faut préciser le chemin dans le fichier `vite.config.js` avec l'attribut `base` dans la section `export default`.  
  
Comme ceci :
``` bash
base: '/musicnavigator',
```
[Fichier de config](https://github.com/Aquilis13/TD_MusiBrainz_-CHANOT_Flora-/blob/main/vite.config.js)
