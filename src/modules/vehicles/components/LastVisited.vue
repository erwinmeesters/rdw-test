<template>
  <div v-if="tableData.length" class="notification is-info is-light">
    <h2>Laatst bekeken</h2>
    <div class="vehicles-list">
      <div class="row" v-for="row in tableData" :key="row.kenteken">
        <span>{{ row.voertuigsoort }}</span>
        <span>{{ row.merk }}</span>
        <span>{{ row.handelsbenaming }}</span>
        <span>{{ row.kenteken }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { getVehicle } from '@/services/vehiclesService';

export default defineComponent({
  setup() {
    const vehicles: any = ref([]);
    const tableData = computed(() => vehicles.value);

    async function fetchVehicles(ids: any = []) {
      vehicles.value = [];
      try {
        ids.map(async (id: string) => {
          const response = await getVehicle(id);
          const [data] = response?.data || {};
          vehicles.value.push(data);
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
      tableData
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
