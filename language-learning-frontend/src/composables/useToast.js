import { ref } from "vue";
export const globalToastRef = ref(null);
export function setGlobalToastRef(refInstance) {
  globalToastRef.value = refInstance;
}