<template>
  <div v-if="pager.total > 10" class="pager">
    <div class="control">
      <span class="select">
        <select :value="pager.perPage" @change="$emit('page-change', ...[1, $event.target.value])">
          <option v-for="(step, index) of calculateSteps()" :key="index" :value="step">{{ step }}</option>
        </select>
      </span>
      <span class="control-label">per page</span>
    </div>
    <nav class="pagination is-right" role="navigation">
      <span v-if="showTotal" class="total">{{ pager.total }} items</span>
      <ul v-if="pager && noOfPages" class="pagination-list">
        <li v-for="page of noOfPages" :key="page">
          <a
            v-if="showLink(page)"
            class="pagination-link"
            :class="{ 'is-current': pager.page === page }"
            @click="$emit('page-change', ...[page, pager.perPage])"
            >{{ page }}</a
          >
          <span v-else-if="showEllipsis(page)" class="pagination-ellipsis">&hellip;</span>
        </li>
        <li>
          <a
            class="pagination-previous"
            @click="$emit('page-change', ...[pager.page - 1, pager.perPage])"
            :class="{ 'is-disabled': pager.page === 1 }"
            ><i class="mdi mdi-chevron-left mdi-24px"
          /></a>
        </li>
        <li>
          <a
            class="pagination-next"
            @click="$emit('page-change', ...[pager.page + 1, pager.perPage])"
            :class="{ 'is-disabled': pager.page === noOfPages }"
            ><i class="mdi mdi-chevron-right mdi-24px"
          /></a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    pagination: {
      type: Object,
      required: true
    },

    showTotal: {
      type: Boolean,
      default: true
    }
  },

  emits: ['page-change'],

  setup(props, { emit }) {
    const pager = computed(() => props.pagination || {});
    const noOfPages = computed(() => Math.ceil(pager.value.total / pager.value.perPage));

    function calculateSteps() {
      const steps: number[] = [];
      const max = pager.value.total > 100 ? 100 : pager.value.total;
      if (max > 60) {
        steps.push(25, 50);
      } else if (max > 40) {
        steps.push(25);
      }
      return [10, ...steps, max];
    }

    function showLink(page: number) {
      const currentPage = pager.value.page;
      if (page === 1 || page === noOfPages.value) {
        return true;
      }
      if (currentPage <= page + 1 && currentPage >= page - 1) {
        return true;
      }
      return false;
    }

    function showEllipsis(page: number) {
      if (!showLink(page) && !showLink(page - 1) && !showLink(page + 1)) {
        return false;
      }
      if (!showLink(page) && !showLink(page + 1)) {
        return false;
      }
      return true;
    }

    return {
      emit,
      pager,
      noOfPages,
      calculateSteps,
      showLink,
      showEllipsis
    };
  }
});
</script>

<style lang="scss" scoped>
.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .control {
    display: flex;
    align-items: center;
  }
  .control-label {
    margin-left: 0.5em;
  }
  .pagination-link.is-current {
    color: $white;
  }
  .pagination {
    &.is-current {
      pointer-events: none;
      cursor: not-allowed;
    }
    .pagination-previous,
    .pagination-next,
    .pagination-link,
    .pagination-ellipsis {
      font-size: 0.9em;
      &.is-disabled {
        pointer-events: none;
        opacity: 0.4;
      }
    }
    .total {
      margin-right: 1em;
    }
  }
}
</style>
