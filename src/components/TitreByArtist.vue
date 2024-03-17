<script>
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Messages from './Messages.vue';

export default {
  components: { Messages },
  data(){
    return {
      idArtist: "",
      musicInfos: null,
      messageInfos: null,
      messageError: null,
      errorStack: null,
      apiKey: null
    }
  },  
  created() {
    this.load();
  },
  methods: {
    /**
     * Fontion lancer au changement et rechargement du composent
     */
    load() {
      // Récupère les paramètre en get...
      if(this.$route.query.apiKey && this.$route.query.id_artist && this.$route.query.apiKey){
        this.idArtist = this.$route.query.id_artist;
        this.apiKey = this.$route.query.apiKey;
        
        // ...et récupère les données dans l'API MusicBrainz
        this.sendApiByArtist();

      // ...si des paramètres GET sont mnqunt on renvoie une erreur à l'utilisateur
      } else {
        this.messageError = "Paramètres manquants, pour résoudre le problème, vous pouvez revenir sur la page précédente avant de tenter de réaccéder à cette page.";
        this.errorStack = null;
      }
    },
    /**
     * Récupère les titres d'un artiste avec l'API MusicBrainz à partir de l'id de l'artiste
     * 
     */
    sendApiByArtist(){
        this.messageInfos = "Chargement des données en cours...";
        
        axios.get(
          "https://musicbrainz.org/ws/2/recording?artist="+this.idArtist+"&fmt=json&api_key="+this.apiKey
        )
        .then(response => {
            this.musicInfos = response.data.recordings; 
            this.messageInfos = null;
        })
        .catch(error => {
          this.messageError = error.message;
          this.errorStack = error.stack;
          console.log("Erreur : ", error);
        })
    },
    /**
     * Renvoie un string avec les minutes et les secondes à partir d'un temps en millisecondes passer en paramètres
     */
    convertMillisecondsInMinutes(milliseconds) {
      if (isNaN(milliseconds)) {
        return 'inconnu';
      }

      let minutes = Math.floor(milliseconds / 60000);
      let seconds = Math.floor((milliseconds % 60000) / 1000);

      return `${minutes} min ${seconds} sec`;
    }
  }
}
</script>

<!-- 
  ░█▀█░█▀▀░█▀▀░▀█▀░█▀▀░█░█░█▀█░█▀▀░█▀▀
  ░█▀█░█▀▀░█▀▀░░█░░█░░░█▀█░█▀█░█░█░█▀▀
  ░▀░▀░▀░░░▀░░░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀▀▀
 -->
<template>
    <Messages :messageError="messageError" :messageInfos="messageInfos" :errorStack="errorStack"></Messages>

    <div id="body_titreByArtist" class="row justify-content-start" v-if="musicInfos != null">
      <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Titre</th>
                    <th scope="col">Date</th>
                    <th scope="col">Duree</th>
                    <th scope="col">-</th>
                </tr>
            </thead>
            <tbody >
                <tr v-for="titre in musicInfos">
                    <td>{{ titre.title }}</td>
                    <td>{{ titre["first-release-date"] }}</td>
                    <td>{{ convertMillisecondsInMinutes(titre.length) }}</td>
                    <td>
                      <RouterLink class="btn btn-primary" :to="{ 
                        path: '/titre-detail', 
                        query: { 
                          titre: titre.title,
                          id_titre: titre.id,
                          apiKey: this.apiKey
                        },
                      }"
                      >Détail</RouterLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>