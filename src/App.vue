<script>
import { RouterLink, RouterView } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.css';

export default {
  data(){
    return {
      searchQuery: "",
      currentRoute: null,
      curentQueryType: null,
      redirectCompteur: 0,
      apiKey: "(flora.chanot1@etu.univ-lorraine.fr)"
    }
  },
  created() {
    this.currentRoute = this.$route.path;
    this.redirectCompteur = 1;
  },
  watch: {
    '$route.fullPath': function() {
      this.currentRoute = this.$route.path;
      this.redirectCompteur = 1;
    },
    '$route.query.type': function() {
      this.curentQueryType = this.$route.query.type;
      this.redirectCompteur = 1;
    }
  },
  methods: {
    submitForm() {
      this.$router.push({ 
        path: '/recherche-titre', 
        query: { 
          search: this.searchQuery,
          type: this.curentQueryType ? this.curentQueryType : 'by-title',
          apiKey: this.apiKey
        },
      });
    },
    goBack() {
      this.$router.go(- this.redirectCompteur);
      this.redirectCompteur += 1;
    }
  }
}
</script>

<template>
  <header>
    <nav id="toolbar" class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="./images/logo.png" alt="Logo" width="35" height="35" class="d-inline-block align-text-top">
          <RouterLink to="/">Music-Navigator</RouterLink>
        </a>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li :class="currentRoute == '/recherche-titre' && curentQueryType == 'by-title' ? 'selected' : null">
              <RouterLink :to="{ 
                  path: '/recherche-titre', 
                  query: { 
                    type: 'by-title'
                  },
                }"
              >Recherche par titre</RouterLink>
            </li>
            <li :class="currentRoute == '/recherche-titre' && curentQueryType == 'by-artist' ? 'selected' : null">
                <RouterLink :to="{ 
                    path: '/recherche-titre', 
                    query: { 
                      type: 'by-artist'
                    },
                  }"
                >Recherche par artiste</RouterLink>
            </li>
          </ul>

          <!-- Recherche ICI ! -->
          <form class="d-flex" role="search" @submit.prevent="submitForm">
            <input class="form-control me-2" type="search" placeholder="Rechercher" aria-label="Search" v-model="searchQuery">
            <RouterLink id="btnRechercher" class="btn btn-light" :to="{ 
                path: '/recherche-titre', 
                query: { 
                  search: searchQuery,
                  type: curentQueryType ? curentQueryType : 'by-title',
                  apiKey: apiKey
                },
              }"
            >OK</RouterLink>
          </form>
        </div>
      </div>
    </nav>
  </header>

  <a @click="goBack" class="link">Retour à la page précédente</a>

  <RouterView />

</template>
