<template>
  <div v-if="loading" class="loader-overlay">
    <div class="spinner" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style lang="scss" scoped>
.loader-overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.7);
}
.spinner {
  animation: spinAround 0.5s infinite linear;
  border: 0.3em solid $xdark;
  border-radius: 100%;
  border-right-color: transparent;
  border-top-color: transparent;
  position: absolute;
  width: 5em;
  height: 5em;
}
</style>
