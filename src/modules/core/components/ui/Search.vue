<template>
  <div class="hero search-bar">
    <form @submit.prevent>
      <div class="search">
        <input type="text" :placeholder="placeholder" :value="query" @keyup="onInput" />
        <span v-if="query" class="clear" @click="$emit('clear')">x</span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: String,
    query: String
  },

  created() {
    if (this.query) {
      this.$emit('onInput', this.query);
    }
  },

  methods: {
    onInput(event) {
      if (event.target.value.length > 2) {
        this.$emit('onInput', event.target.value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  justify-content: center;
}
.search {
  position: relative;
  display: flex;
  width: 350px;
  input {
    width: 100%;
  }
  .clear {
    width: 25px;
    color: $xdarkgrey;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.2em;
    position: absolute;
    right: 0;
    top: 0;
    height: 40px;
  }
}
</style>
