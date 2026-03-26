<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 150
  }
})

const canvas = ref(null)

const generateQR = () => {
  if (!canvas.value || !props.value) return
  
  const ctx = canvas.value.getContext('2d')
  const size = props.size
  const moduleCount = 25 // QR modules
  const moduleSize = size / moduleCount
  
  canvas.value.width = size
  canvas.value.height = size
  
  // Clear canvas
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  
  // Generate deterministic pattern from value
  const hash = hashCode(props.value)
  const pattern = generatePattern(hash, moduleCount)
  
  // Draw QR pattern
  ctx.fillStyle = '#000000'
  
  // Draw finder patterns (corners)
  drawFinderPattern(ctx, 0, 0, moduleSize)
  drawFinderPattern(ctx, (moduleCount - 7) * moduleSize, 0, moduleSize)
  drawFinderPattern(ctx, 0, (moduleCount - 7) * moduleSize, moduleSize)
  
  // Draw timing patterns
  for (let i = 8; i < moduleCount - 8; i++) {
    if (i % 2 === 0) {
      ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize)
      ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize)
    }
  }
  
  // Draw data modules
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isDataArea(row, col, moduleCount) && pattern[row * moduleCount + col]) {
        ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
      }
    }
  }
}

const drawFinderPattern = (ctx, x, y, moduleSize) => {
  // Outer square
  ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize)
  
  // White middle
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)
  
  // Inner square
  ctx.fillStyle = '#000000'
  ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
}

const isDataArea = (row, col, moduleCount) => {
  // Exclude finder patterns
  if (row < 9 && col < 9) return false
  if (row < 9 && col >= moduleCount - 8) return false
  if (row >= moduleCount - 8 && col < 9) return false
  
  // Exclude timing patterns
  if (row === 6 || col === 6) return false
  
  return true
}

const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

const generatePattern = (seed, moduleCount) => {
  const pattern = []
  let value = seed
  
  for (let i = 0; i < moduleCount * moduleCount; i++) {
    value = (value * 1103515245 + 12345) & 0x7fffffff
    pattern.push(value % 3 === 0)
  }
  
  return pattern
}

onMounted(generateQR)
watch(() => [props.value, props.size], generateQR)
</script>
