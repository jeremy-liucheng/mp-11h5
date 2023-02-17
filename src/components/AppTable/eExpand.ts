import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Expand',
  props: {
    row: {
      require: true,
      type: Object,
      default: () => {}
    },
    render: {
      type: Function,
      require: true,
      default: () => {}
    },
    column: {
      type: Object,
      default: null
    }
  },
  render() {
    return this.render(this.row!);
  }
});
