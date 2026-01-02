<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const props = defineProps<{
  user: User
}>();
const open = defineModel<boolean>('open');
const emit = defineEmits(['success']);

const toast = useToast();
const loading = ref(false);

const schema = z.object({
  name: z.string('Nazwa jest wymagana'),
  email: z.email('Nieprawidłowy adres email'),
});
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
});

watch(() => props.user, (newVal) => {
  if (newVal) {
    state.name = newVal.name;
    state.email = newVal.email;
  }
}, { immediate: true });

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;

  try {
    await $fetch('/api/auth', {
      method: 'PUT',
      body: event.data,
    });

    emit('success');
    toast.add({ title: 'Pomyślnie edytowano twoje konto', color: 'success', icon: 'i-heroicons-check-circle' });
    open.value = false;
  } catch (e) {
    console.error(e);
    toast.add({ title: 'Błąd podczas edycji konta', color: 'error', icon: 'i-heroicons-x-circle' });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UModal
      v-model:open="open"
      title="Edytuj dane konta"
      description="Edytujesz swoje konto"
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
        <UFormField label="Nazwa użytkownika" name="name">
          <UInput v-model="state.name" icon="i-heroicons-user" class="w-full" autocomplete="name"/>
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" icon="i-heroicons-envelope" class="w-full" autocomplete="email"/>
        </UFormField>


        <UButton type="submit" block :loading="loading" icon="i-lucide-save" :disabled="loading">
          Edytuj dane
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped>

</style>