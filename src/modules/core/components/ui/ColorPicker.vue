<template>
  <div class="color-picker">
    <div class="color-picker-title">Filter op kleur...</div>
    <div class="swatches">
      <span
        v-for="(color, index) in colors"
        :key="index"
        @click="$emit('selection', color)"
        :style="{ 'background-color': swatches[color] }"
        class="swatch"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colors: Array
  },

  emits: ['selection'],

  setup() {
    const swatches = {
      rood: '#f00',
      oranje: '#f90',
      geel: '#ff0',
      groen: '#0f0',
      blauw: '#00f',
      paars: '#f0f',
      zwart: '#000',
      wit: '#fff',
      grijs: '#ddd'
    };
    return {
      swatches
    };
  }
};
</script>

<style lang="scss" scoped>
.color-picker {
  display: flex;
  flex-direction: column;
  margin: 0 1em;
}
.color-picker-title {
  font-size: 12px;
  margin: 0;
  margin-bottom: 5px;
}
.swatches {
  display: flex;
}
.swatch {
  height: 25px;
  width: 25px;
  cursor: pointer;
}
</style>
