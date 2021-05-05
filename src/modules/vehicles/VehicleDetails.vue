<template>
  <div class="section">
    <div class="overview">
      <div v-for="(row, index) in vehicle" :key="index" class="row">
        <span class="name">{{ row.name }}</span>
        <span class="value">{{ row.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getVehicle } from '@/services/vehiclesService';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route: any = useRoute();
    const vehicle: any = ref([]);

    async function fetchVehicle() {
      const { id } = route.params;

      try {
        const response = await getVehicle(id);
        const [data] = response.data;
        const details: any = [];
        Object.keys(data).map(key => {
          const detail = {
            name: key.split('_').join(' '),
            value: data[key]
          };
          details.push(detail);
        });

        vehicle.value = details;
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(() => {
      fetchVehicle();
    });

    return {
      vehicle
    };
  }
});
</script>

<style lang="scss" scoped>
.overview {
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  border-top: 1px solid $medgrey;
  padding: 0.6em;
  &:nth-child(odd) {
    background: $lightgrey;
  }
  .name {
    font-weight: bold;
    margin-right: 2em;
    flex: 1;
    text-align: right;
  }
  .value {
    flex: 1;
  }
}
</style>
