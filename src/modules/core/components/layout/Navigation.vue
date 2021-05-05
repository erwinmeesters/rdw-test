<template>
  <div class="nav">
    <div class="nav-list"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  align-items: center;
  margin: 0 2em;
  background: $xdark;
  height: $header-height;

  .nav-list {
    display: flex;
    flex: 1;
    color: $white;
    height: 100%;

    a {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: flex-end;
      color: $white;
      box-shadow: 1px 0 0 0 $medlight;
      width: 90px;
      font-size: 14px;
      border-bottom: 5px solid transparent;

      &:hover {
        border-bottom-color: $white;
        text-decoration: none;
      }
      &:first-child {
        box-shadow: -1px 0 0 0 $medlight, 1px 0 0 0 $medlight;
      }
      i {
        color: $white;
        font-size: 24px;
      }
      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: $xdark;

        img {
          width: 20px;
          height: 20px;
        }
      }
      &.router-link-active {
        border-bottom-color: $white;
        pointer-events: none;
      }
    }
  }
}
</style>
