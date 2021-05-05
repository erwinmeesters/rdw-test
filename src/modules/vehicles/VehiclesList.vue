<template>
  <div class="section">
    <div class="filters">
      <search placeholder="Zoeken..." :query="searchTerm" @onInput="setSearchTerm" @clear="clearSearchTerm" />
      <color-picker :colors="colors" @selection="setSearchTerm" />
    </div>
    <data-table
      :data="tableData"
      :model="tableModel"
      :fromTop="80"
      @sorted="sortData"
      @reload="reloadData"
      @row-clicked="showVehicle"
      emptyMessage="No vehicles found"
    >
    </data-table>
    <pager :pagination="pagination" @page-change="setPage" :showTotal="false" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { getVehicles } from '@/services/vehiclesService';
import DataTable from '@/modules/core/components/ui/DataTable';
import Pager from '@/modules/core/components/ui/Pager';
import vehiclesTable from './schemas/vehicles-table.ts';
import { useRoute } from 'vue-router';
import router from '@/router';
import Search from '@/modules/core/components/ui/Search';
import ColorPicker from '@/modules/core/components/ui/ColorPicker';

export default defineComponent({
  components: {
    DataTable,
    Pager,
    Search,
    ColorPicker
  },

  setup() {
    const route: any = useRoute();
    const searchTerm = ref('');
    const tableModel = ref(vehiclesTable);
    const vehicles: any = ref([]);
    const tableData = computed(() => vehicles.value);
    const colors = ref(['rood', 'oranje', 'geel', 'groen', 'blauw', 'paars', 'zwart', 'wit', 'grijs']);
    const pagination = reactive({
      total: 1000,
      page: +route.query.page || 1,
      perPage: +route.query.perPage || 10,
      orderBy: route.query.orderBy || 'merk',
      direction: route.query.direction || 'asc'
    });

    function setPage(page: number, perPage: number) {
      pagination.page = page;
      pagination.perPage = perPage;
      fetchVehicles();
    }

    async function fetchVehicles(q = '') {
      searchTerm.value = q;
      const { page, perPage, orderBy, direction } = pagination;
      const query = { page, perPage, orderBy, direction };
      router.replace({ query });
      try {
        const response = await getVehicles(q, page, perPage, orderBy, direction);
        vehicles.value = response?.data || [];
      } catch (error) {
        console.log(error);
      }
    }

    function sortData(event: any) {
      const [orderBy]: any = Object.keys(event);
      const direction = event[orderBy];
      pagination.orderBy = orderBy;
      pagination.direction = direction;
      fetchVehicles();
    }

    function reloadData() {
      pagination.orderBy = 'merk';
      pagination.direction = 'asc';
      fetchVehicles();
    }

    function showVehicle(event: any) {
      router.push({
        name: 'vehicle',
        params: {
          id: event.kenteken
        }
      });
    }

    function setSearchTerm(event: string) {
      fetchVehicles(event);
    }

    function clearSearchTerm() {
      searchTerm.value = '';
      fetchVehicles();
    }

    onMounted(() => {
      fetchVehicles();
    });

    return {
      tableData,
      tableModel,
      sortData,
      reloadData,
      fetchVehicles,
      pagination,
      setPage,
      showVehicle,
      searchTerm,
      setSearchTerm,
      clearSearchTerm,
      colors
    };
  }
});
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $xdarkgrey;
  padding: 1em;
  color: $white;
  position: sticky;
  top: 0;
  z-index: 9;
}
</style>
