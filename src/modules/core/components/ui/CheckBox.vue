<template>
  <label class="wrapper">
    <input type="checkbox" @change="emit('input', $event.target.checked)" :checked="checked" :disabled="disabled" />
    <span class="checkmark-box" :class="{ 'is-disabled': disabled }">
      <span class="checkmark"></span>
    </span>
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      default: ''
    },
    checked: {
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],

  setup(props, { emit }) {
    return {
      emit
    };
  }
});
</script>

<style lang="scss" scoped>
/* The container */
.wrapper {
  display: flex;
  margin-bottom: 0;
  cursor: pointer;
  user-select: none;
  margin: 0;

  &:hover input ~ .checkmark-box {
    border-color: $xdark;
  }

  input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
    &:checked ~ .checkmark-box {
      background-color: $xdark;
      border-color: $xdark;
    }
    &:checked ~ .checkmark-box .checkmark {
      display: block;
    }
  }

  .checkmark-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    background: transparent;
    border: 2px solid $darkgrey;

    .checkmark {
      display: none;
      width: 7px;
      height: 12px;
      border: solid $white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      margin-bottom: 3px;
    }
  }
  .checkbox-label {
    margin-left: 0.5em;
  }
}
</style>
