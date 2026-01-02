<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const open = defineModel<boolean>('open');
const emit = defineEmits(['success']);
const toast = useToast();
const loading = ref(false);

const schema = z.object({
  name: z.string('Nazwa jest wymagana'),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  description: undefined,
  isPublic: false,
});

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;

  try {
    await $fetch('/api/playlists', {
      method: 'POST',
      body: event.data,
    });

    emit('success');
    toast.add({ title: 'Pomyślnie dodano playlistę', color: 'success', icon: 'i-heroicons-check-circle' });
    open.value = false;
  } catch (e) {
    console.error(e);
    toast.add({ title: 'Błąd podczas tworzenia playlisty', color: 'error', icon: 'i-heroicons-x-circle' });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UModal
      v-model:open="open"
      title="Dodaj nową playlistę"
      description="Dodaj nową playlistę do swojej kolekcji"
      :ui="{ description: 'sr-only' }"
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
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Nazwa" name="name">
          <UInput v-model="state.name" class="w-full"/>
        </UFormField>

        <UFormField label="Opis" hint="Opcjonalny" name="description">
          <UTextarea v-model="state.description" :rows="4" :maxrows="4" autoresize class="w-full"/>
        </UFormField>

        <UFormField name="isPublic">
          <UCheckbox v-model="state.isPublic" label="Czy playlista ma być publiczna?" class="w-full"/>
        </UFormField>

        <UButton type="submit" block :loading="loading" icon="i-lucide-plus" :disabled="loading">
          Dodaj playlistę
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped>

</style>