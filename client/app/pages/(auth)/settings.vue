<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const toast = useToast();
const router = useRouter();
const auth = useAuthStore();
const isEditOpen = ref(false);
const loading = ref(false);

const handleDelete = async () => {
  if (!confirm('Jesteś absolutnie pewien? To usunie WSZYSTKIE Twoje playlisty i dane bezpowrotnie.')) return;

  loading.value = true;
  try {
    await $fetch('/api/auth', { method: 'DELETE' });

    auth.logout();
    router.push('/login');
    toast.add({ title: 'Konto zostało usunięte', color: 'success' });
  } catch (e) {
    console.error(e);
    toast.add({ title: 'Nie udało się usunąć konta', color: 'error' });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UPage v-if="auth.user">
    <UPageHeader
        title="Twoje Konto"
        description="Tutaj możesz zarządzać swoim kontem"
    />
    <UPageBody>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold flex items-center gap-2">
              <UIcon name="i-heroicons-user-circle" class="w-5 h-5"/>
              Twój Profil
            </h3>
            <UButton size="xs" variant="ghost" icon="i-lucide-edit-2" @click="isEditOpen = true">
              Edytuj
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Nazwa wyświetlana</label>
            <p class="text-lg font-medium">{{ auth.user.name }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Adres Email</label>
            <p class="text-gray-900 dark:text-gray-200">{{ auth.user.email }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 uppercase font-semibold">Dołączono</label>
            <p class="text-sm text-gray-500">{{ new Date(auth.user.createdAt).toLocaleDateString() }}</p>
          </div>
        </div>
      </UCard>
      <div class="border-t border-gray-200 dark:border-gray-800 pt-8">
        <h3 class="text-lg font-bold text-red-600 mb-4">Strefa niebezpieczna</h3>
        <div
            class="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-gray-900 dark:text-gray-100">Usuń konto</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Bezpowrotnie usuwa konto i wszystkie Twoje playlisty. Tej operacji nie można cofnąć.
            </p>
          </div>
          <UButton
              color="error"
              variant="solid"
              label="Usuń moje konto"
              :loading="loading"
              @click="handleDelete"
          />
        </div>
      </div>
    </UPageBody>

    <LazyUserEditModal v-model:open="isEditOpen" :user="auth.user as User" @success="auth.fetchUser"/>
  </UPage>
</template>

<style scoped>

</style>