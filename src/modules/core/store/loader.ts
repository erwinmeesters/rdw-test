import { reactive } from 'vue';

export const loader = reactive({
  show: false,
  start: () => (loader.show = true),
  stop: () => (loader.show = false)
});
