<script setup lang="ts">
</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transform transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-full opacity-0"
    >
      <div
          v-if="open"
          class="fixed bottom-4 left-4 right-4 z-60 flex justify-center"
      >
        <div class="relative w-full max-w-3xl shadow-2xl rounded-xl overflow-hidden bg-black border border-gray-800">

          <iframe
              :src="embedUrl"
              width="100%"
              height="152"
              frameBorder="0"
              :allowfullscreen="false"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              class="block"
          />

          <div class="absolute top-1 right-10">
            <UButton
                icon="i-heroicons-x-mark"
                color="neutral"
                variant="ghost"
                size="xl"
                @click="open = false"
            />
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>