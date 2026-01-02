<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const props = defineProps<{
  playlist: Playlist
}>();
const open = defineModel<boolean>('open');
const emit = defineEmits(['success']);

const toast = useToast();
const router = useRouter();
const loadingEdit = ref(false);
const loadingDelete = ref(false);

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

watch(() => props.playlist, (newVal) => {
  if (newVal) {
    state.name = newVal.name;
    state.description = newVal.description || '';
    state.isPublic = newVal.isPublic;
  }
}, { immediate: true });

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  loadingEdit.value = true;

  try {
    await $fetch(`/api/playlists/${props.playlist.id}`, {
      method: 'PATCH',
      body: event.data,
    });

    emit('success');
    toast.add({ title: 'Pomyślnie edytowano playlistę', color: 'success' });
    open.value = false;
  } catch (e) {
    console.error(e);
    toast.add({ title: 'Błąd podczas edytowania playlisty', color: 'error' });
  } finally {
    loadingEdit.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('Czy na pewno chcesz bezpowrotnie usunąć tę playlistę?')) {
    return;
  }
  loadingDelete.value = true;

  try {
    await $fetch(`/api/playlists/${props.playlist.id}`, {
      method: 'DELETE',
    });
    toast.add({ title: 'Pomyślnie usunięto playlistę', color: 'success' });
    open.value = false;
    router.push('/playlists');
  } catch (e) {
    console.error(e);
    toast.add({ title: 'Błąd podczas usuwania playlisty', color: 'error' });
  } finally {
    loadingDelete.value = false;
  }
};
</script>

<template>
  <UModal
      v-model:open="open"
      title="Edytuj playlistę"
      :description="`Edytujesz playlistę ${props.playlist.name}`"
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

        <UButton type="submit" block :loading="loadingEdit" icon="i-lucide-save" :disabled="loadingEdit">
          Edytuj playlistę
        </UButton>
      </UForm>

      <UButton
          label="Usuń playlistę" block class="mt-4" color="error" variant="outline" icon="i-lucide-trash"
          @click="handleDelete"
      />
    </template>
  </UModal>
</template>

<style scoped>

</style>