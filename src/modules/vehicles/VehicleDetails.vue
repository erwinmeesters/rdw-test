<template>
  <div class="section">
    <last-visited />

    <router-link title="RDW" :to="{ path: '/', query: route.query }">
      <i class="feather icon-arrow-left" />Terug naar overzicht
    </router-link>
    <div v-if="vehicle.length" class="overview">
      <div v-for="(row, index) in vehicle" :key="index" class="row">
        <span class="name">{{ row.name }}</span>
        <span class="value">{{ row.value }}</span>
      </div>
    </div>
    <div v-else class="empty">Voertuig niet gevonden / beschikbaar...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getVehicle } from '@/services/vehiclesService';
import { useRoute } from 'vue-router';
import LastVisited from './components/LastVisited';

export default defineComponent({
  components: {
    LastVisited
  },

  setup() {
    const route: any = useRoute();
    const vehicle: any = ref([]);

    async function fetchVehicle() {
      const { id } = route.params;

      try {
        const response = await getVehicle(id);
        const [data] = response.data;
        updateLastVisited(data.kenteken);
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
        vehicle.value = [];
      }
    }

    function updateLastVisited(id: string) {
      let lastVisited: any = [];
      const stored: any = localStorage.getItem('lastVisited');
      if (stored) {
        lastVisited = JSON.parse(stored);
      }
      lastVisited.unshift(id);
      lastVisited = [...new Set(lastVisited)];
      if (lastVisited.length > 3) {
        lastVisited.pop();
      }
      localStorage.setItem('lastVisited', JSON.stringify(lastVisited));
    }

    onMounted(() => {
      fetchVehicle();
    });

    return {
      vehicle,
      route
    };
  }
});
</script>

<style lang="scss" scoped>
.overview {
  display: flex;
  flex-direction: column;
  margin-top: 2em;
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
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
