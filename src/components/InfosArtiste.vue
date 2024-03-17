<script>
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import TitreByArtist from "./TitreByArtist.vue";
import Messages from './Messages.vue';

export default {
  components: { TitreByArtist, Messages },
  props: ['query'],
  data(){
    return {
      id_artiste: "",
      artistInfos: null,
      messageError: null,
      messageInfos: "test",
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
      if (this.$route.query.id_artist && this.$route.query.apiKey) {
        this.id_artiste = this.$route.query.id_artist;
        this.apiKey = this.$route.query.apiKey;

        // ...et récupère les données dans l'API MusicBrainz
        this.sendToApi();

      // ...si des paramètres GET sont manquant on renvoie une erreur à l'utilisateur
      } else {
        this.messageError = "Paramètres manquants, pour résoudre le problème, vous pouvez revenir sur la page précédente avant de tenter de réaccéder à cette page.";
        this.errorStack = null;
      }
    },
    /**
     * Récupère les infos d'un artiste avec l'API MusicBrainz à partir de l'id de l'artiste
     * 
     */
    sendToApi(){
        this.messageInfos = "Chargement des données en cours...";

        axios.get(
          "https://musicbrainz.org/ws/2/artist/"+this.id_artiste+"?fmt=json&api_key="+this.apiKey
        )
        .then(response => {
            this.artistInfos = response.data; 
            this.messageInfos = null;
        })
        .catch(error => {
          this.messageError = error.message;
          this.errorStack = error.stack;
          console.log("Erreur : ", error);
        })
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

  <div id="container" v-if="artistInfos != null">
    <header>
      <h3>Détail de l'artiste {{ artistInfos.name }}</h3>
    </header>

    <div id="body_ArtistDetail">      
      <span v-if='artistInfos.disambiguation != null && artistInfos.disambiguation != ""'>
        <b>homonymie : </b>{{ artistInfos.disambiguation }} 
        <br />
      </span>

      <b>Pays : </b> {{ artistInfos.area && artistInfos.area.name ? artistInfos.area.name : "inconnu" }} <br />
      <b>Type : </b> {{ artistInfos.type ? artistInfos.type : "inconnu" }} 

      <div id="life">
        <h4>Vie :</h4>
        
        <div>
          <b>Date de naissance : </b> {{ artistInfos['life-span'].begin ? artistInfos['life-span'].begin : "inconnu" }} <br />

          <span v-if="artistInfos['life-span'].end != null && artistInfos['life-span'].end != ''">
            <b>Mort : </b> {{ artistInfos['life-span'].end }} <br />
          </span>
        </div>
      </div>

      <h4>Discographie :</h4>
      <TitreByArtist></TitreByArtist>
    </div>
  </div>
</template>