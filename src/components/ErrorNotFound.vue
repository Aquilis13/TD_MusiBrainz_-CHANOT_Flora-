<script>
import { RouterLink } from 'vue-router';

export default {
    components: { RouterLink }
}
</script>

<template>
  <div class="not_found_error">
    <h1>404 Error Page</h1>
      <p class="zoom-area">La page à laquelle vous cherchez à accéder n'est pas accessible. </p>
      <section class="error-container">
        <span class="four"><span class="screen-reader-text">4</span></span>
        <span class="zero"><span class="screen-reader-text">0</span></span>
        <span class="four"><span class="screen-reader-text">4</span></span>
      </section>
      <div class="link-container">
        <RouterLink class="more-link" to="/">
          Retour à la page d'accueil
        </RouterLink>
      </div>
  </div>
</template>
