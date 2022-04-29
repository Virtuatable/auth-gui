<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  private uri: string = '';

  mounted() {
    this.uri = window.location.href
  }
}
</script>

<template>
  <div>URI : {{ uri }}</div>
</template>