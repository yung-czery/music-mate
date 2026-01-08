<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();

const open = defineModel<boolean>('open');

const emit = defineEmits<{
  (e: 'confirm' | 'cancel'): void;
}>();
</script>

<template>
  <UModal
      v-model:open="open"
      :title="title"
      :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full',
          onClick: () => {
            open = false
          }
        }"
      :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <p>{{ description }}</p>
    </template>
    <template #footer>
      <UButton
          color="neutral"
          variant="outline"
          class="w-25 justify-center"
          @click="() => { emit('cancel'); open = false; }"
      >
        Anuluj
      </UButton>
      <UButton
          color="primary"
          class="w-25 justify-center"
          @click="() => { emit('confirm'); open = false; }"
      >
        Potwierdź
      </UButton>
    </template>
  </UModal>
</template>

<style scoped>

</style>