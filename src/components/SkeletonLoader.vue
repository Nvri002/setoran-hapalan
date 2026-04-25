<template>
  <div class="space-y-5 animate-fade-in">
    <!-- Profile card skeleton -->
    <div class="card p-6">
      <div class="flex items-start gap-5">
        <div class="skeleton w-[72px] h-[72px] rounded-2xl shrink-0"></div>
        <div class="flex-1 space-y-3 pt-1">
          <div class="skeleton h-6 w-48"></div>
          <div class="skeleton h-4 w-32"></div>
          <div class="flex gap-2">
            <div class="skeleton h-6 w-20 rounded-full"></div>
            <div class="skeleton h-6 w-24 rounded-full"></div>
          </div>
        </div>
      </div>
      <div class="mt-6 space-y-2.5">
        <div class="flex justify-between">
          <div class="skeleton h-4 w-28"></div>
          <div class="skeleton h-4 w-10"></div>
        </div>
        <div class="skeleton h-2.5 w-full rounded-full"></div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3">
      <div v-for="i in 3" :key="i" class="card p-5 space-y-2">
        <div class="skeleton h-3 w-16"></div>
        <div class="skeleton h-8 w-12"></div>
      </div>
    </div>

    <!-- Surah grid -->
    <div class="card p-6">
      <div class="skeleton h-5 w-32 mb-5"></div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div v-for="i in 16" :key="i" class="skeleton h-20 rounded-xl"></div>
      </div>
    </div>
  </div>
</template>
