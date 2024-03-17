<script>
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Messages from './Messages.vue';

export default {
  components: { Messages },
  data(){
    return {
        search: "",
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
  watch: {
    '$route.query.search': function() {
      this.load();
    }
  },
  methods: {
    /**
     * Fontion lancer au changement et rechargement du composent
     */
    load() {
      this.messageInfos = null;

      // Récupère les paramètre en get...
      if(!this.$route.query.apiKey){
        // S'il manque l'apiKey on indique à l'utilisateur qu'il manque des paramètre
        this.messageInfos = "Paramètres manquants, pour résoudre le problème, vous pouvez revenir sur la page précédente avant de tenter de réaccéder à cette page.";
      
      } else if (this.$route.query.search) {
        this.search = this.$route.query.search;
        this.apiKey = this.$route.query.apiKey;
        
        // Récupère les données dans l'API MusicBrainz soit en fontion d'un auteur soit d'un nom de titre
        switch (this.$route.query.type) {
          case 'by-artist':
            this.sendtoApi("https://musicbrainz.org/ws/2/recording?query=artist:"+this.search+"&fmt=json&api_key="+this.apiKey);
            break;
          default:
            // On reherche en fonction du nom de titre par défaut
            this.sendtoApi("https://musicbrainz.org/ws/2/recording?query="+this.search+"&fmt=json&api_key="+this.apiKey);
        }

      // S'il manque le paramètre contenant la recherche de l'utilisateur 
      // on lui indique qu'il peut faire une recherche avec le input dans la barre de navigation
      } else {
        this.messageInfos = "Vous pouvez effectuer une recherche à l'aide du champ en haut à droite.";
      }
    },
    /**
     * Récupère les titres avec l'API MusicBrainz avec soit le nom d'un titre ou soit le nom d'un auteur
     * 
     */
    sendtoApi(url){
      this.messageInfos = "Chargement des données en cours...";

      axios.get(url)
      .then(response => {
        this.musicInfos = response.data.recordings;
        this.messageInfos = null;

        // Si aucun titre n'est trouver on l'indique à l'utilisateur
        if(this.musicInfos != null && this.musicInfos.length == 0){
          this.messageInfos = "Aucune musique n'a été trouvée avec la recherche renseignée.";
        }
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

  <div id="container" v-if="musicInfos !=null">
    <header>
      <h3>Résultats pour la recherche de titres</h3>
    </header>

    <div id="body_ResultatRecherche" class="row justify-content-start">
      <div v-for="titre in musicInfos" class="col-sm-5 col-xl-3">
        <div class="card-container">

          <div class="card mb-3 ">
            <div class="card-header">
              {{ titre.title }}
            </div>
            <div class="card-body">
              <p class="card-text">
                <b>Date de parrution :</b> {{ titre['first-release-date'] }} <br />
                <b>Artiste :</b> {{ titre['artist-credit'][0].name }} <br />
                <b>Score :</b> {{ titre.score }} <br />
                <b>Durée :</b> {{ convertMillisecondsInMinutes(titre.length) }}

                <div>
                  <b>Tags :</b>
                  
                  <div>
                    <div v-for="tag in titre.tags" >
                      <span class="badge text-bg-secondary">
                        # {{ tag.name }}
                      </span>
                    </div>
                  </div>
                  
                  <span v-if="titre.tags == null">
                    Aucun tags
                  </span>
                </div>

                <div>
                  <RouterLink class="btn btn-primary" :to="{ 
                    path: '/artist', 
                    query: { 
                      id_artist: titre['artist-credit'][0]['artist'].id,
                      apiKey: this.apiKey
                    },
                  }"
                  >Découvrir l'artiste</RouterLink>

                  <RouterLink class="btn btn-primary" :to="{ 
                    path: '/titre-detail', 
                    query: { 
                      titre: titre.title,
                      id_titre: titre.id,
                      apiKey: this.apiKey
                    },
                  }"
                  >Détail du titre</RouterLink>
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>