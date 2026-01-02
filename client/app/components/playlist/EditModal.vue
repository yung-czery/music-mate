<script setup lang="ts">
const open = defineModel<boolean>('open');
</script>

<template>
  <UModal
      v-model:open="open"
      title="Edytuj playlistę"
      :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full',
          onClick: () => {
            open = false
          }
        }"
  >
    <template #body>
      tu bedzie form
    </template>
  </UModal>
</template>

<style scoped>

</style>