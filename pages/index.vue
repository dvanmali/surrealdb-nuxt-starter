<template>
  <div>
    <h1 v-if="pending">
      {{ pending }}
    </h1>
    <h1 v-else-if="error">
      {{ error }}
    </h1>
    <h1 v-else>
      {{ data }}
    </h1>
  </div>
</template>

<script lang="ts" setup>
const { data, pending, error } = useLazyFetch('/api/hello-world')
</script>

<style></style>
