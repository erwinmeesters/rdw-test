<template>
  <div class="image">
    <img v-if="media.length" class="thumb" :src="thumb(media)" />
    <img v-else class="no-image" src="~@/assets/images/no-image.svg" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    media: {
      type: Array,
      required: true
    }
  },

  setup() {
    function thumb(files: any) {
      const file = files.find((value: any) => value.type === 'iiif');
      if (file) {
        return file.uri.replace('/info.json', '/full/200,/0/default.jpg');
      }
    }

    return {
      thumb
    };
  }
});
</script>

<style lang="scss" scoped>
.thumb {
  max-height: 60px;
}
.no-image {
  opacity: 0.6;
  max-height: 25px;
}
</style>
