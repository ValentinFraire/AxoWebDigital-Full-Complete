import { ref, isRef } from 'vue';

export default function useFetch(url, baseOptions = {}) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const fetchData = async (overrideOptions = {}) => {
    loading.value = true;
    error.value = null;

    const finalUrl = isRef(url) ? url.value : url;

    try {
      const response = await fetch(finalUrl, {
        ...baseOptions,
        ...overrideOptions,
        headers: {
          'Content-Type': 'application/json',
          ...(baseOptions.headers || {}),
          ...(overrideOptions.headers || {})
        },
        body: overrideOptions.body
          ? JSON.stringify(overrideOptions.body)
          : baseOptions.body
          ? JSON.stringify(baseOptions.body)
          : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      data.value = result;
      return result;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const post = (body) => fetchData({ method: 'POST', body });
  const put = (body) => fetchData({ method: 'PUT', body });
  const del = (body) => fetchData({ method: 'DELETE', body });
  const get = () => fetchData({ method: 'GET' });

  return {
    data,
    error,
    loading,
    refetch: fetchData,
    post,
    put,
    del,
    get
  };
}
