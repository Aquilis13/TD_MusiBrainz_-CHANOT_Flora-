<script>
import 'bootstrap/dist/css/bootstrap.css';

export default {
  props: {
      messageError: {
        type: [String, null],
        default: ""
      },
      errorStack: {
        type: [String, null],
        default: ""
      },
      messageInfos: {
        type: [String, null],
        default: ""
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
    <div class="alert alert-danger" role="alert" v-if="messageError != null">
      <span name="danger">!</span>
      <b>Une erreur est survenu : </b>
      {{ messageError }} <br />

      <div v-if="errorStack != null">
        <b>Pile d'erreur : </b>
        {{ errorStack }}
      </div>
  </div>

  <div class="alert alert-info" role="alert" v-if="messageError == null && messageInfos != null">
    <span name="info">i</span>
    {{ messageInfos }}
  </div>
</template>