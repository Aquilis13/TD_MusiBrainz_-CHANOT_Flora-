import { createRouter, createWebHistory } from 'vue-router'
import ResultatRecherche from '@/components/ResultatRecherche.vue'
import InfosArtiste from '@/components/InfosArtiste.vue'
import DetailMusic from '@/components/DetailMusic.vue'
import Home from '@/components/Home.vue'
import ErrorNotFound from '@/components/ErrorNotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/recherche-titre',
      name: 'searchByTitle',
      component: ResultatRecherche,
      props: (route) => ({ query: route.query.q })
    },
    {
      path: '/titre-detail',
      name: 'titre',
      component: DetailMusic
    },
    {
      path: '/artist',
      name: 'artiste',
      component: InfosArtiste,
      props: (route) => ({ query: route.query.q })
    },
    {
      path: '/:pathMatch(.*)',
      name: 'error404',
      component: ErrorNotFound
    },
  ]
})

export default router
