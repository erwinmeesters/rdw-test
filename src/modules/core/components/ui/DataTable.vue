<template>
  <div v-if="renderedData.length" class="table">
    <div class="table-head" :style="{ top: `${fromTop}px` }">
      <div class="table-row">
        <span v-if="isSelectable" :style="{ 'max-width': '50px' }" class="table-col">
          <check-box @input="selectAllRows($event)" :checked="isAllChecked()" />
        </span>

        <span
          v-for="(col, index) in tableHead"
          :key="index"
          :style="{ 'min-width': setWidth(col.options) }"
          :class="setClasses(col.options)"
          @click.stop="sort(col)"
          class="table-col"
          ><div class="table-col-head">
            <span>{{ col.value }}</span>
            <span v-if="col.options.sortable" class="sorting-icon">
              <span v-if="sortedColumn.id === col.options.sortable">
                <span v-if="sortedColumn.direction === 0" class="sorting-neutral">
                  <i class="feather icon-arrow-down" />
                  <i class="feather icon-arrow-up" />
                </span>
                <i v-if="sortedColumn.direction === 1" class="feather icon-arrow-down" />
                <i v-if="sortedColumn.direction === 2" class="feather icon-arrow-up" />
              </span>
              <span v-else class="sorting-neutral">
                <i class="feather icon-arrow-down" />
                <i class="feather icon-arrow-up" />
              </span>
            </span>
          </div>
        </span>
        <div v-if="hasSlot" :style="{ 'max-width': '140px' }" class="table-col">Actions</div>
      </div>
    </div>
    <div class="table-body">
      <div v-for="(row, i) in renderedData" :key="i" class="table-row-wrapper">
        <div
          @click="isDetailed ? showDetails(i) : isClickable ? rowClicked('row-clicked', i) : null"
          :class="[
            { 'is-clickable': isClickable || isDetailed },
            { 'details-active': clickedRow === i },
            { striped: i % 2 === 0 }
          ]"
          class="table-row"
        >
          <span v-if="isSelectable" :style="{ 'max-width': '50px' }" @click.stop class="table-col">
            <check-box @input="rowClicked('rows-checked', i, $event)" :checked="isChecked(i)" />
          </span>

          <span
            v-for="(col, key) in row.main"
            :key="key"
            :style="{ 'min-width': setWidth(col.options) }"
            :class="setClasses(col.options)"
            class="table-col"
          >
            <i v-if="col.options.class" :class="[col.options.class, 'table-icon']" />
            <div
              v-for="(item, k) in col.value"
              :key="k"
              :class="{
                'has-text-weight-semibold': col.value.length > 1 && k === 0,
                summary: col.value.length > 1 && k
              }"
            >
              <image-thumb v-if="key === 'media'" :media="item" />
              <div v-else>
                <i v-if="booleanValue(item)" :class="['feather has-text-weight-bold', booleanValue(item)]" />
                <div v-else>
                  <slot v-if="specialSlot && col.options.slot" name="special" :item="item" />
                  <div v-else class="summary-txt">{{ itemName(item, col.options) }}</div>
                </div>
              </div>
            </div>
          </span>
          <span v-if="hasSlot" :style="{ 'max-width': '140px' }" class="table-col action-btns">
            <slot :row="tableData[i]"></slot>
          </span>
        </div>
        <transition name="details" mode="out-in" appear>
          <div v-if="clickedRow === i && row.details" class="table-row details">
            <slot v-if="detailsSlot" name="details" :row="tableData[i]" />
            <div v-else class="table-col">{{ row.details }}</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
  <div v-else class="empty">{{ emptyMessage }}</div>
</template>
<script lang="ts">
import { computed, defineComponent, inject, reactive, ref, watch, watchEffect } from 'vue';
import CheckBox from './CheckBox';
import ImageThumb from './ImageThumb';

export default defineComponent({
  components: {
    CheckBox,
    ImageThumb
  },

  props: {
    data: {
      type: Array,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    defaultSort: {
      type: String,
      default: ''
    },
    defaultSortDirection: {
      type: String,
      default: 'default'
    },
    emptyMessage: {
      type: String
    },
    fromTop: {
      type: Number,
      default: 0
    }
  },

  emits: ['row-clicked', 'row-edit', 'row-delete', 'rows-checked', 'sorted', 'reload', 'show-details'],

  setup(props, { emit, slots }) {
    const hasSlot = computed(() => {
      const slot = slots.default ? slots.default() : [];
      return !!slot.length;
    });
    const detailsSlot = computed(() => slots.details);
    const specialSlot = computed(() => slots.special);
    const tableData: any = computed(() => props.data);
    const tableModel: any = computed(() => props.model);
    const renderedData: any = ref([]);
    const tableHead: any = ref({});
    const isClickable = ref(false);
    const isSelectable = ref(false);
    const isDetailed = ref('');
    const selectedRows: any = ref([]);
    const clickedRow: any = ref(-1);
    const allRowsSelected = ref(false);
    const sortedDirections = ['default', 'asc', 'desc'];
    const sortedColumn = reactive({
      id: props.defaultSort,
      direction: sortedDirections.indexOf(props.defaultSortDirection)
    });

    const clearSelected: any = inject('clearSelectedRows', ref(false));
    watchEffect(() => {
      if (clearSelected.value) {
        selectAllRows(false);
      }
    });

    watch([tableData, tableModel], ([data, model]) => {
      if (Object.keys(model).length) {
        tableHead.value = mapTableHead();
        isClickable.value = tableModel.value.options.detailed ? false : tableModel.value.options.clickable;
        isSelectable.value = tableModel.value.options.selectable;
        isDetailed.value = tableModel.value.options.detailed;
      }
      if (data || data.length) {
        renderedData.value = mapDataOnModel();
      }
    });

    function rowClicked(action: any, index: number, checked = false) {
      const data: any = tableData.value;
      if (action === 'rows-checked') {
        if (checked) {
          selectedRows.value.push(data[index]);
        } else {
          selectedRows.value = selectedRows.value.filter(
            (row: any) => JSON.stringify(row) !== JSON.stringify(data[index])
          );
        }
        return emit(action, JSON.parse(JSON.stringify(selectedRows.value)));
      }
      return emit(action, data[index]);
    }

    function showDetails(index: number) {
      clickedRow.value = clickedRow.value !== index ? index : -1;
      emit('show-details', tableData.value[index]);
    }

    function booleanValue(item: any) {
      return item === true ? 'icon-check has-text-success' : item === false ? 'icon-x has-text-danger' : false;
    }

    function selectAllRows(event: boolean) {
      allRowsSelected.value = event;
      const data = tableData.value;
      selectedRows.value = event ? data : [];
      emit('rows-checked', JSON.parse(JSON.stringify(selectedRows.value)));
    }

    function isChecked(index: number) {
      const data: any = tableData.value;
      allRowsSelected.value = !!selectedRows.value.length === data.length;
      return selectedRows.value.findIndex((row: any) => JSON.stringify(row) === JSON.stringify(data[index])) !== -1;
    }

    function isAllChecked() {
      return tableData.value.length === selectedRows.value.length || allRowsSelected.value;
    }

    function mapTableHead() {
      const obj: any = {};
      tableModel.value.columns.map((prop: any) => {
        obj[prop.id] = {
          id: prop.id,
          value: prop.label,
          options: {}
        };
        obj[prop.id].options = prop.options;
      });

      return obj;
    }

    function mapDataOnModel() {
      if (!tableModel.value.columns) return tableData;

      const output: any = [];

      tableData.value.map((row: any) => {
        const obj: any = {
          main: {},
          details: ''
        };

        obj.details = row[isDetailed.value];

        tableModel.value.columns.map((prop: any) => {
          obj.main[prop.id] = {
            value: {},
            options: {}
          };
          obj.main[prop.id].options = prop.options;
          if (prop.columns?.length) {
            const group: any = [];
            prop.columns.map((p: any) => {
              if (Object.keys(row).includes(p.id)) {
                group.push(row[p.id]);
                obj.main[prop.id].value = group;
              }
            });
          } else if (Object.keys(row).includes(prop.id)) {
            obj.main[prop.id].value = [row[prop.id]];
          }
        });

        output.push(obj);
      });

      return output;
    }

    function setWidth(options: any) {
      return options?.width ? `${options.width}px` : 'none';
    }

    function setClasses(options: any) {
      const classes = [];
      if (options && options.classes) {
        classes.push(options.classes);
      }
      if (options.sortable) {
        classes.push('is-sortable');
      }
      return classes.join(', ');
    }

    function sort(column: any) {
      if (!column.options.sortable) return;

      const output: any = {};
      if (sortedColumn.id === column.options.sortable) {
        sortedColumn.direction = sortedColumn.direction !== 2 ? ++sortedColumn.direction : 0;
      } else {
        sortedColumn.id = column.options.sortable;
        sortedColumn.direction = 1;
      }

      output[sortedColumn.id] = sortedDirections[sortedColumn.direction];
      sortedColumn.direction ? emit('sorted', output) : emit('reload');
    }

    function itemName(item: any | string, opt: any): string {
      const value = opt.type === 'date' ? new Date(item) : item;
      // All possible item title properties //
      return value.name || value.label || value.title || value;
    }

    return {
      tableData,
      renderedData,
      tableHead,
      hasSlot,
      detailsSlot,
      specialSlot,
      rowClicked,
      setWidth,
      setClasses,
      isClickable,
      isSelectable,
      isDetailed,
      selectedRows,
      selectAllRows,
      isChecked,
      isAllChecked,
      sortedColumn,
      sort,
      clickedRow,
      showDetails,
      booleanValue,
      itemName
    };
  }
});
</script>

<style lang="scss" scoped>
.table-row-wrapper {
  display: flex;
  flex: 1 1 100%;
  flex-flow: row wrap;
}
.table-head {
  font-weight: 700;
  position: sticky;
  top: 0px;
  z-index: 200;
  background: $white;
  border-bottom: 1px solid $darkgrey;
  .is-sortable {
    cursor: pointer;
  }
  .sorting-icon {
    margin: 0 0.5em;
    color: $darkgrey;
    i {
      font-weight: bold;
    }
  }
  .sorting-neutral {
    i {
      margin-right: -7px;
    }
  }
}
.table-body {
  display: flex;
  flex-flow: row wrap;
}
.table-row {
  display: flex;
  flex: 1 1 100%;
  align-items: center;
  z-index: 2;
  &.striped {
    background: $lightgrey;
  }

  &.details {
    box-shadow: inset 0 1px 3px $medgrey;
    background: $lightgrey;
    z-index: 1;
    padding: 1em;
  }

  .table-body & {
    border-top: 1px solid $medgrey;
    min-height: 75px;
  }
  &.is-clickable {
    cursor: pointer;
    &:hover {
      background: $lightgrey;
    }
  }
  &.details-active {
    border-left: 3px solid $xdark;
    .table-icon {
      display: block;
      transform: rotate(90deg);
    }
  }
}
.table-col {
  flex: 1;
  font-size: 1em;
  padding: 1em;
  overflow: hidden;

  .table-col-head {
    display: flex;
  }
}
.action-btns {
  min-width: 140px;
  :deep(.button) {
    margin-right: 0.6em;
  }
}
.table-icon {
  font-size: 1.5em;
  color: $darkgrey;
}

.details-enter-active {
  animation: topslidein 0.2s;
}
.details-leave-to {
  animation: topslideout 0.2s;
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}
</style>
