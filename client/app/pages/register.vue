<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

definePageMeta({
  layout: false,
});

const auth = useAuthStore();
const toast = useToast();

const schema = z.object({
  name: z.string().min(3, 'Nazwa użytkownika musi zawierać min. 3 znaki'),
  email: z.email('Wprowadź poprawny adres e-mail'),
  password: z.string().min(6, 'Hasło musi mieć min. 6 znaków'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła muszą być takie same',
  path: ['confirmPassword'],
});

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
});

const handleRegister = async (event: FormSubmitEvent<Schema>) => {
  try {
    const { confirmPassword, ...payload } = event.data;
    await auth.register(payload);

    toast.add({
      title: 'Sukces!',
      description: 'Zarejestrowano pomyślnie',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    });

    navigateTo('/');
  } catch (e) {
    console.error(e);
    toast.add({
      title: 'Błąd',
      description: 'Wystapił błąd podzczas rejestracji',
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
        <h2 class="text-xl font-bold text-center text-primary-500">Zarejestruj się</h2>
      </template>

      <UForm :schema="schema" validate-on="change" :state="state" class="space-y-4" @submit="handleRegister">
        <UFormField label="Nazwa użytkownika" name="name">
          <UInput v-model="state.name" icon="i-heroicons-user" class="w-full" autocomplete="off"/>
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" icon="i-heroicons-envelope" class="w-full" autocomplete="off"/>
        </UFormField>

        <UFormField label="Hasło" name="password">
          <UInput
              v-model="state.password" type="password" icon="i-heroicons-lock-closed" class="w-full"
              autocomplete="new-password"/>
        </UFormField>

        <UFormField label="Potwierdź hasło" name="confirmPassword">
          <UInput
              v-model="state.confirmPassword" type="password" icon="i-heroicons-lock-closed" class="w-full"
              autocomplete="new-password"/>
        </UFormField>

        <UButton type="submit" :loading="auth.loading" block>
          Zarejestruj się
        </UButton>
      </UForm>
    </UCard>

    <UCard class="w-full max-w-sm">
      <template #header>
        <h2 class="text-xl font-bold text-center text-primary-500">Masz już konto?</h2>
      </template>

      <UButton to="/login" block color="primary">
        Zaloguj się
      </UButton>
    </UCard>
  </div>
</template>

<style scoped>

</style>