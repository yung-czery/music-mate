export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: [
          'cursor-pointer'
        ],
      }
    },
    header: {
      slots: {
        toggle: 'lg:inline-flex',
        content: 'lg:flex',
        center: 'flex flex-grow',
      }
    }
  }
})