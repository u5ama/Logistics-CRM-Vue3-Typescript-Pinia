import { POSITION, type PluginOptions } from "vue-toastification";

/**
 * Config object for the `vue-toastification` plugin
 */
const toastOptions: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  draggable: false,
  closeOnClick: false,
};

export default toastOptions;
