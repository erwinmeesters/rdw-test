<template>
  <div class="error-message">
    <h1>404</h1>
    <h2>Deze pagina bestaat helaas niet (meer)...</h2>
    <router-link v-slot="{ route }" :to="{ name: 'vehicles' }">
      <div
        class="nav-item"
        :class="{
          'router-link-active': $route.path.startsWith(route.path)
        }"
      >
        <span>Klik hier om terug te keren naar de home pagina</span>
      </div>
    </router-link>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({});
</script>

<style lang="scss" scoped>
.error-message {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 2em;
  text-align: center;
  height: calc(100vh - #{$header-height});
}
</style>
