import { computed } from "vue";
import { useServiceStore } from "../Stores/ServiceStore";

export function useFilteredServiceCategories() {
  const serviceStore = useServiceStore();

  const filteredServiceCategories = computed(() => {
    const categories = new Set();
    serviceStore.services.forEach((service) => {
      if (service.category) {
        categories.add(service.category);
      }
    });
    return Array.from(categories);
  });

  return filteredServiceCategories;
}




