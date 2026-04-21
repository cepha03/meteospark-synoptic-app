export function startTheme() {
  const toggleDark = document.getElementById('btn-toggle-dark')
  const htmlElement = document.documentElement

  //checking local storage or system preference on initial load
  if (
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }

  //handle manual toggling with validation to ensure dark mode is toggled
  if (toggleDark) {
    toggleDark.addEventListener('click', () => {
      htmlElement.classList.toggle('dark')
      
      if (htmlElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark')
      } else {
        localStorage.setItem('theme', 'light')
      }
    })
  }
}