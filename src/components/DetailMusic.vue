<script>
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Messages from './Messages.vue';

export default {
    components: { Messages },
    data(){
        return {
            titre: "",
            id_titre: "",
            type: "by-name",
            listMusics: null,
            musicDetail: null,
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
            if (this.$route.query.titre && this.$route.query.id_titre && this.$route.query.apiKey) {
                this.titre = this.$route.query.titre;
                this.id_titre = this.$route.query.id_titre;
                this.apiKey = this.$route.query.apiKey;

                // ...et récupère les données dans l'API MusicBrainz
                this.sendtoApiByTitle();

            // ...si des paramètres GET sont mnqunt on renvoie une erreur à l'utilisateur
            } else {
                this.messageError = "Paramètres manquants, pour résoudre le problème, vous pouvez revenir sur la page précédente avant de tenter de réaccéder à cette page.";
                this.errorStack = null;
            }
        },
        /**
         * Récupère un titre avec l'API MusicBrainz à partir du nom d'une musique et de son id
         * 
         */
        sendtoApiByTitle(){
            this.messageInfos = "Chargement des données en cours...";

            axios.get(
                "https://musicbrainz.org/ws/2/recording?query="+this.titre+"&fmt=json&api_key="+this.apiKey
            )
            .then(response => {
                this.listMusics = response.data.recordings;

                // Parcourt les données pour trouver le titre qui correspond
                this.listMusics.forEach((music) => {
                    if(this.id_titre == music.id){
                        this.musicDetail = music;
                    }
                });
                this.messageInfos = null;

                if(this.musicDetail == null){
                    this.sendtoApiById();
                }
            })
            .catch(error => {
                this.messageError = error.message;
                this.errorStack = error.stack;
                console.log("Erreur : ", error);
            })
        },
        /**
         * Récupère un titre avec l'API MusicBrainz à partir de l'id d'une musique
         * 
         */
         sendtoApiById(){
            this.messageInfos = "Chargement des données en cours...";

            axios.get(
                "https://musicbrainz.org/ws/2/recording/"+this.id_titre+"?fmt=json&api_key="+this.apiKey
            )
            .then(response => {
                this.musicDetail = response.data;
                this.type = "by-id";
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

    <div id="container" v-if="musicDetail != null && type == 'by-id'">
        <header>
            <h3>Détail du titre {{ titre }}</h3>
        </header>

        <div id="body_MusicDetail">     
            <b>Date de parrution :</b> {{ musicDetail['first-release-date'] }} <br />
            <b>Homonymie :</b> {{ musicDetail.disambiguation ? musicDetail.disambiguation : "aucune"}} <br />
            <b>Durée :</b> {{ convertMillisecondsInMinutes(musicDetail.length) }}<br />
        </div>
    </div>

    <div id="container" v-if="musicDetail != null && type == 'by-name'">
        <header>
            <h3>Détail du titre {{ titre }}</h3>
        </header>

        <div id="body_MusicDetail">     
            <b>Date de parrution :</b> {{ musicDetail['first-release-date'] }} <br />
            <b>Artiste :</b> {{ musicDetail['artist-credit'][0].name }} <br />
            <b>Score :</b> {{ musicDetail.score }} <br />
            <b>Durée :</b> {{ convertMillisecondsInMinutes(musicDetail.length) }}<br />

            <h4>Sorties :</h4>
            <div v-for="relase in musicDetail.releases">  
                <h5>{{ relase.disambiguation ? relase.disambiguation : relase.title }}</h5>
                <div>
                    <b>Nombre de piste :</b> {{ relase["track-count"] }}<br />
                    <b>{{ relase["release-group"]["primary-type"] }} :</b> {{ relase["release-group"].title }}<br /><br />
                </div>
                
                <div v-if="relase['release-events'] && relase['release-events'].length > 0">
                    <h5>Événement :</h5>
                    <div v-for="event in relase['release-events']">
                        <b>Nom : </b> {{ event.area.name }}<br />
                        <b>Nom raccoucie : </b> {{ event.area["sort-name"] }}<br />
                        <br />
                    </div>
                </div>

                <div v-if="relase.media && relase.media.length > 0">
                    <h5>Média :</h5>
                    <div v-for="media in relase.media">
                        <b>Titre : </b>{{ media.format }}<br />
                        <b>Format : </b>{{ media.track[0].title }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
