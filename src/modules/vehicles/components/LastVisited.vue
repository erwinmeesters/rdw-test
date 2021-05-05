<template>
  <div v-if="vehicles.length" class="notification is-info is-light">
    <h2>Laatst bekeken</h2>
    <div class="vehicles-list">
      <div class="row" v-for="(row, index) in vehicles" :key="index">
        <span>{{ row.data.voertuigsoort }}</span>
        <span>{{ row.data.merk }}</span>
        <span>{{ row.data.handelsbenaming }}</span>
        <span>{{ row.data.kenteken }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watchEffect } from 'vue';
import { getVehicle } from '@/services/vehiclesService';

export default defineComponent({
  setup() {
    const vehicles: any = ref([]);

    watchEffect(() => {
      vehicles.value = vehicles.value.sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
    });

    async function fetchVehicles(ids: any = []) {
      vehicles.value = [];
      try {
        ids.map(async (id: string, index: number) => {
          const response = await getVehicle(id);
          const [data] = response?.data || {};
          vehicles.value.push({ index, data });
        });
      } catch (error) {
        console.log(error);
        vehicles.value = [];
      }
    }

    onBeforeMount(() => {
      const ids = localStorage.getItem('lastVisited');
      if (ids) {
        fetchVehicles(JSON.parse(ids));
      }
    });

    return {
      vehicles
    };
  }
});
</script>

<style lang="scss" scoped>
.notification {
  margin-bottom: 3em;
}
.vehicles-list {
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    border-bottom: 1px solid $medgrey;
    padding: 5px 0;
    &:last-child {
      border-bottom: none;
    }
  }
  span {
    margin: 0 1em;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
