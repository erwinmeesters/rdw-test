<template>
  <div>
    <app-header />
    <div class="main">
      <loader :loading="loader.show" />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { loader } from '@/modules/core/store/loader';
import Loader from '@/modules/core/components/ui/Loader';
import AppHeader from '@/modules/core/components/layout/AppHeader';

export default defineComponent({
  components: {
    AppHeader,
    Loader
  },

  setup() {
    return {
      loader
    };
  }
});
</script>

<style lang="scss">
@import './assets/styles/app.scss';
.main {
  height: auto;
  min-height: calc(100vh - #{$header-height});
}
</style>
