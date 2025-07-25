<script setup lang="ts">
import GameCanvas from '@/components/GameCanvas.vue'

import type { BreadcrumbItem } from '@/types';
</script>

<template>
    <div class="min-h-screen min-w-screen bg-gray-900 text-white flex items-center justify-center">
        <GameCanvas />
    </div>
</template>
