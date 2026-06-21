declare module 'alpinejs' {
  interface Alpine {
    plugin(plugin: unknown): void
    start(): void
  }
  const Alpine: Alpine
  export default Alpine
}

declare module '@alpinejs/focus' {
  const focus: unknown
  export default focus
}
