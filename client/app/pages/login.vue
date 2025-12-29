<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

definePageMeta({
  layout: false,
});

const auth = useAuthStore();
const toast = useToast();

const schema = z.object({
  email: z.email('Wprowadź poprawny adres e-mail'),
  password: z.string().min(6, 'Hasło musi mieć min. 6 znaków'),
});
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const handleLogin = async (event: FormSubmitEvent<Schema>) => {
  try {
    await auth.login(event.data);

    toast.add({
      title: 'Sukces!',
      description: 'Zalogowano pomyślnie',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    });

    navigateTo('/');
  } catch (e) {
    console.error(e);
    toast.add({
      title: 'Błąd',
      description: 'Nieprawidłowe dane logowania',
      color: 'error',
      icon: 'i-heroicons-x-circle',
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-950">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h2 class="text-xl font-bold text-center text-primary-500">Zaloguj się</h2>
      </template>

      <UForm :schema="schema" validate-on="change" :state="state" class="space-y-4" @submit="handleLogin">
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" icon="i-heroicons-envelope" class="w-full"/>
        </UFormField>

        <UFormField label="Hasło" name="password">
          <UInput v-model="state.password" type="password" icon="i-heroicons-lock-closed" class="w-full"/>
        </UFormField>

        <UButton type="submit" :loading="auth.loading" block>
          Zaloguj się
        </UButton>
      </UForm>
    </UCard>

    <UCard class="w-full max-w-sm">
      <template #header>
        <h2 class="text-xl font-bold text-center text-primary-500">Nie masz konta?</h2>
      </template>

      <UButton to="/register" block color="primary">
        Zarejestruj się
      </UButton>
    </UCard>
  </div>
</template>