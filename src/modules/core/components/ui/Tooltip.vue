<template>
  <span ref="tooltip" :class="rootClasses">
    <transition :name="newAnimation">
      <div v-show="active && (isActive || always)" ref="content" :class="['tooltip-content', contentClass]">
        <template v-if="label">{{ label }}</template>
        <template v-else-if="$slots.content">
          <slot name="content" />
        </template>
      </div>
    </transition>
    <div
      ref="trigger"
      class="tooltip-trigger"
      :style="triggerStyle"
      @click="onClick"
      @contextmenu="onContextMenu"
      @mouseenter="onHover"
      @focus.capture="onFocus"
      @blur.capture="close"
      @mouseleave="close"
    >
      <slot ref="slot" />
    </div>
  </span>
</template>

<script>
/* eslint-disable no-restricted-syntax */
export default {
  name: 'BTooltip',
  props: {
    active: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'is-primary'
    },
    label: String,
    delay: {
      type: Number,
      default: null
    },
    position: {
      type: String,
      default: 'is-top',
      validator(value) {
        return ['is-top', 'is-bottom', 'is-left', 'is-right'].indexOf(value) > -1;
      }
    },
    triggers: {
      type: Array,
      default: () => ['hover']
    },
    always: Boolean,
    square: Boolean,
    dashed: Boolean,
    multilined: Boolean,
    size: {
      type: String,
      default: 'is-medium'
    },
    appendToBody: Boolean,
    animated: {
      type: Boolean,
      default: true
    },
    animation: {
      type: String,
      default: ''
    },
    contentClass: String,
    autoClose: {
      type: [Array, Boolean],
      default: true
    }
  },
  data() {
    return {
      isActive: false,
      triggerStyle: {},
      timer: null,
      // eslint-disable-next-line vue/no-reserved-keys
      _bodyEl: undefined // Used to append to body
    };
  },
  computed: {
    rootClasses() {
      return [
        'tooltip',
        this.type,
        this.position,
        this.size,
        {
          'is-square': this.square,
          'is-always': this.always,
          'is-multiline': this.multilined,
          'is-dashed': this.dashed
        }
      ];
    },
    newAnimation() {
      return this.animated ? this.animation : undefined;
    }
  },
  watch: {
    isActive() {
      if (this.appendToBody) {
        this.updateAppendToBody();
      }
    }
  },
  methods: {
    createAbsoluteElement(el) {
      const root = document.createElement('div');
      root.style.position = 'absolute';
      root.style.left = '0px';
      root.style.top = '0px';
      root.style.width = '100%';
      const wrapper = document.createElement('div');
      root.appendChild(wrapper);
      wrapper.appendChild(el);
      document.body.appendChild(root);
      return root;
    },

    removeElement(el) {
      if (typeof el.remove !== 'undefined') {
        el.remove();
      } else if (typeof el.parentNode !== 'undefined' && el.parentNode !== null) {
        el.parentNode.removeChild(el);
      }
    },

    updateAppendToBody() {
      const { tooltip } = this.$refs;
      const { trigger } = this.$refs;
      if (tooltip && trigger) {
        // update wrapper tooltip
        const tooltipEl = this.$data._bodyEl.children[0];
        tooltipEl.classList.forEach(item => tooltipEl.classList.remove(item));
        if (this.$vnode && this.$vnode.data && this.$vnode.data.staticClass) {
          tooltipEl.classList.add(this.$vnode.data.staticClass);
        }
        this.rootClasses.forEach(item => {
          if (typeof item === 'object') {
            for (const key in item) {
              if (item[key]) {
                tooltipEl.classList.add(key);
              }
            }
          } else {
            tooltipEl.classList.add(item);
          }
        });
        tooltipEl.style.width = `${trigger.clientWidth}px`;
        tooltipEl.style.height = `${trigger.clientHeight}px`;
        const rect = trigger.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const left = rect.left + window.scrollX;
        const wrapper = this.$data._bodyEl;
        wrapper.style.position = 'absolute';
        wrapper.style.top = `${top}px`;
        wrapper.style.left = `${left}px`;
        wrapper.style.zIndex = this.isActive || this.always ? '99' : '-1';
        this.triggerStyle = { zIndex: this.isActive || this.always ? '100' : undefined };
      }
    },
    onClick() {
      if (this.triggers.indexOf('click') < 0) return;
      // if not active, toggle after clickOutside event
      // this fixes toggling programmatic
      this.$nextTick(() => {
        setTimeout(() => this.open());
      });
    },
    onHover() {
      if (this.triggers.indexOf('hover') < 0) return;
      this.open();
    },
    onContextMenu(e) {
      if (this.triggers.indexOf('contextmenu') < 0) return;
      e.preventDefault();
      this.open();
    },
    onFocus() {
      if (this.triggers.indexOf('focus') < 0) return;
      this.open();
    },
    open() {
      if (this.delay) {
        this.timer = setTimeout(() => {
          this.isActive = true;
          this.timer = null;
        }, this.delay);
      } else {
        this.isActive = true;
      }
    },
    close() {
      if (typeof this.autoClose === 'boolean') {
        this.isActive = !this.autoClose;
        if (this.autoClose && this.timer) clearTimeout(this.timer);
      }
    },
    /**
     * Close tooltip if clicked outside.
     */
    clickedOutside(event) {
      if (this.isActive) {
        if (Array.isArray(this.autoClose)) {
          if (this.autoClose.indexOf('outside') >= 0) {
            if (!this.isInWhiteList(event.target)) this.isActive = false;
          } else if (this.autoClose.indexOf('inside') >= 0) {
            if (this.isInWhiteList(event.target)) this.isActive = false;
          }
        }
      }
    },
    /**
     * Keypress event that is bound to the document
     */
    keyPress({ key }) {
      if (this.isActive && (key === 'Escape' || key === 'Esc')) {
        if (Array.isArray(this.autoClose)) {
          if (this.autoClose.indexOf('escape') >= 0) this.isActive = false;
        }
      }
    },
    /**
     * White-listed items to not close when clicked.
     */
    isInWhiteList(el) {
      if (el === this.$refs.content) return true;
      // All chidren from content
      if (this.$refs.content !== undefined) {
        const children = this.$refs.content.querySelectorAll('*');
        for (const child of children) {
          if (el === child) {
            return true;
          }
        }
      }
      return false;
    }
  },
  mounted() {
    if (this.appendToBody && typeof window !== 'undefined') {
      this.$data._bodyEl = this.createAbsoluteElement(this.$refs.content);
      this.updateAppendToBody();
    }
  },
  created() {
    if (typeof window !== 'undefined') {
      document.addEventListener('click', this.clickedOutside);
      document.addEventListener('keyup', this.keyPress);
    }
  },

  beforeUnmount() {
    if (typeof window !== 'undefined') {
      document.removeEventListener('click', this.clickedOutside);
      document.removeEventListener('keyup', this.keyPress);
    }
    if (this.appendToBody) {
      this.removeElement(this.$data._bodyEl);
    }
  }
};
</script>

<style lang="scss" scoped>
$tooltip-arrow-size: 5px !default;
$tooltip-arrow-margin: 2px !default;
$tooltip-multiline-sizes: (
  small: 180px,
  medium: 240px,
  large: 300px
) !default;

$primary: $xdarkgrey !default;

@mixin tooltip-arrow-color($direction, $color) {
  @if ($direction == 'is-top') {
    border-top-color: $color;
  } @else if ($direction == 'is-bottom') {
    border-bottom-color: $color;
  } @else if ($direction == 'is-right') {
    border-right-color: $color;
  } @else if ($direction == 'is-left') {
    border-left-color: $color;
  }
}

@mixin tooltip($direction) {
  &.#{$direction} {
    .tooltip-content {
      @if ($direction == 'is-top') {
        top: auto;
        right: auto;
        bottom: calc(100% + #{$tooltip-arrow-size} + #{$tooltip-arrow-margin});
        left: 50%;
        transform: translateX(-50%);
      } @else if ($direction == 'is-bottom') {
        top: calc(100% + #{$tooltip-arrow-size} + #{$tooltip-arrow-margin});
        right: auto;
        bottom: auto;
        left: 50%;
        transform: translateX(-50%);
      } @else if ($direction == 'is-right') {
        top: 50%;
        right: auto;
        bottom: auto;
        left: calc(100% + #{$tooltip-arrow-size} + #{$tooltip-arrow-margin});
        transform: translateY(-50%);
      } @else if ($direction == 'is-left') {
        top: 50%;
        right: calc(100% + #{$tooltip-arrow-size} + #{$tooltip-arrow-margin});
        bottom: auto;
        left: auto;
        transform: translateY(-50%);
      }
    }
    .tooltip-content::before {
      @if ($direction == 'is-bottom') {
        top: auto;
        right: auto;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-right: $tooltip-arrow-size solid transparent;
        border-bottom: $tooltip-arrow-size solid $primary;
        border-left: $tooltip-arrow-size solid transparent;
      } @else if ($direction == 'is-top') {
        top: 100%;
        right: auto;
        bottom: auto;
        left: 50%;
        transform: translateX(-50%);
        border-top: $tooltip-arrow-size solid $primary;
        border-right: $tooltip-arrow-size solid transparent;
        border-left: $tooltip-arrow-size solid transparent;
      } @else if ($direction == 'is-left') {
        top: 50%;
        right: auto;
        bottom: auto;
        left: 100%;
        transform: translateY(-50%);
        border-top: $tooltip-arrow-size solid transparent;
        border-bottom: $tooltip-arrow-size solid transparent;
        border-left: $tooltip-arrow-size solid $primary;
      } @else if ($direction == 'is-right') {
        top: 50%;
        right: 100%;
        bottom: auto;
        left: auto;
        transform: translateY(-50%);
        border-top: $tooltip-arrow-size solid transparent;
        border-right: $tooltip-arrow-size solid $primary;
        border-bottom: $tooltip-arrow-size solid transparent;
      }
    }

    .tooltip-content::before {
      @include tooltip-arrow-color($direction, $primary);
    }
  }
}

// Base
.tooltip {
  @include tooltip('is-top');
  @include tooltip('is-right');
  @include tooltip('is-bottom');
  @include tooltip('is-left');
  position: relative;
  display: inline-flex;
  .tooltip-content {
    width: auto;
    padding: 0.35rem 0.75rem;
    border-radius: $radius-large;
    font-size: 0.85rem;
    font-weight: normal;
    box-shadow: 0px 1px 2px 1px rgba(0, 1, 0, 0.2);
    z-index: 38;
    white-space: nowrap;
    position: absolute;
    background: $xdarkgrey;
    color: $white;
    &::before {
      position: absolute;
      content: '';
      pointer-events: none;
      z-index: 38;
    }
  }

  .tooltip-trigger {
    width: 100%;
  }

  &.is-always {
    .tooltip-content::before,
    .tooltip-content {
      opacity: 1;
      visibility: visible;
    }
  }
  &.is-multiline {
    .tooltip-content {
      display: flex-block;
      text-align: center;
      white-space: normal;
    }
    @each $name, $size in $tooltip-multiline-sizes {
      &.is-#{$name} {
        .tooltip-content {
          width: $size;
        }
      }
    }
  }
  &.is-dashed {
    .tooltip-trigger {
      border-bottom: 1px dashed $medgrey;
      cursor: default;
    }
  }
  &.is-square {
    .tooltip-content {
      border-radius: 0;
    }
  }
}
</style>
