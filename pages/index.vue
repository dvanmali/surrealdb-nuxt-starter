<template>
  <div>
    <h1>
      Server Fetch
    </h1>
    <h2 v-if="status === 'pending' || status === 'idle'">
      {{ status }}
    </h2>
    <h2 v-else-if="error">
      {{ error }}
    </h2>
    <h2 v-else>
      {{ data }}
    </h2>
  </div>
</template>

<script lang="ts" setup>
const { data, status, error } = useLazyFetch('/api/hello-world')
</script>

<style></style>
