<template>
  <div class="header">
    <nav class="navigation">
      <div class="logo">
        <router-link title="RDW" :to="'/'">
          <img :src="require('@/assets/images/logo.svg')" />
        </router-link>
      </div>
      <!-- <navigation /> -->
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
//import Navigation from './Navigation';

export default defineComponent({
  components: {
    // Navigation
  }
});
</script>

<style lang="scss" scoped>
.header {
  height: $header-height;
  background: $white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2em;
  border-bottom: 1px solid $medgrey;

  .navigation {
    display: flex;
    align-items: flex-end;
    flex: 1;
  }

  .logo,
  .logo a {
    display: flex;
    width: 100%;
  }
  .logo {
    width: 85px;
    max-height: $header-height;
    margin-bottom: 1px;

    img {
      width: 100%;
    }
  }
}
</style>
