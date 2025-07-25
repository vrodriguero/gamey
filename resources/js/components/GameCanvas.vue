<script setup lang="ts">
import { onMounted } from 'vue'
import { launchPhaser } from '@/phaser/phaser.js'

onMounted(() => {
    launchPhaser()
})
</script>

<template>
    <div id="phaser-container" class="size-fit"></div>
</template>
