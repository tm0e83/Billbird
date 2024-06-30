<script setup>
import { ref, watch, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useStore } from '@/stores/store'
import githubLogo from '@/assets/images/github-logo.svg'
import { getAuth, signOut } from 'firebase/auth'
import { router, publicPages } from './router'
import { LoginIcon, LogoutIcon } from 'vue-tabler-icons'

const store = useStore()
const auth = getAuth()
const isLoggedIn = ref(false)

watch(
  () => store.uid,
  () => (isLoggedIn.value = !!store.uid)
)

function login() {
  router.push('/login')
}

function logout() {
  if (store.uid === 'testuser') {
    store.uid = null
    router.push('/login')
  } else {
    signOut(auth)
      .then(async () => {
        store.uid = null
        router.push('/login')
      })
      .catch(() => {
        console.log('failed to logout')

        notify({
          title: 'Es ist ein Fehler aufgetreten',
          type: 'error'
        })
      })
  }
}

onMounted(() => {
  const authRequired = !publicPages.includes(router.currentRoute.value.name)

  if (authRequired && !store.uid) {
    return '/login'
  }
})
// onBeforeMount(() => {
//   store.isTouchDevice = 'ontouchstart' in window;
// });
</script>

<template>
  <header>
    <div class="inner">
      <a class="logo" href="/overview">
        <span class="font-color">Bill</span><span class="text-primary">Bird</span>
        <span class="version font-mono">alpha</span>
      </a>
      <div class="nav-container">
        <nav class="nav-main">
          <RouterLink v-if="!isLoggedIn" to="/overview">Übersicht</RouterLink>
          <RouterLink v-if="isLoggedIn" to="/data">Daten</RouterLink>
          <RouterLink to="/faq">FAQ</RouterLink>
        </nav>
        <nav class="nav-user">
          <a v-if="!isLoggedIn" @click="login" class="menu-item login">
            <LoginIcon />
            <span>Einloggen</span>
          </a>
          <a v-else @click="logout" class="menu-item logout">
            <LogoutIcon />
            <span>Ausloggen</span>
          </a>
          <a href="https://github.com/tm0e83/billbird" title="auf Github anzeigen" target="_blank">
            <img :src="githubLogo" alt="Github Logo" />
          </a>
        </nav>
      </div>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <notifications position="bottom right" classes="bb-notification" width="360px" />
</template>

<style lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

header {
  padding: 0.75rem;
  background-color: #fff;
  // --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  // --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  // box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

  .inner {
    width: 100%;
    margin: auto;

    @media (min-width: 640px) {
      display: flex;
      align-items: center;
    }
  }
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 900;
  position: relative;
  line-height: 1;
}

.version {
  font-size: 0.75rem;
  line-height: 1rem;
  align-self: flex-end;
  color: $red-600;
  margin-left: 0.25rem;
  font-weight: 700;
}

.nav-container {
  display: flex;
  flex-grow: 1;
  align-self: flex-end;
  align-items: center;
  margin-top: 0.75rem;
}

.nav-main {
  display: flex;
  flex-grow: 1;
  column-gap: 3rem;

  a {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    color: $gray-400;

    &.router-link-active {
      color: #000;
      cursor: default;
    }

    &:hover {
      color: #000;
    }
  }

  @media (min-width: 640px) {
    margin-left: 5rem;
  }
}

.nav-user {
  display: flex;
  column-gap: 2rem;

  a {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .menu-item svg {
    width: 1.25rem;
    height: 1.25rem;
    transform: scale(-1);
  }

  .menu-item.login + span {
    display: none;

    @media (min-width: 768px) {
      display: inline;
    }
  }

  @media (min-width: 640px) {
    column-gap: 3rem /* 48px */;
  }
}

// style of the notification itself
.bb-notification {
  // styling
  margin: 0 5px 5px;
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  border-radius: $global-radius;

  // default (blue)
  background: #44a4fc;
  border-left: 5px solid #187fe7;

  // types (green, amber, red)
  &.success {
    background: #68cd86;
    border-left-color: #42a85f;
  }

  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.error {
    background: #e54d42;
    border-left-color: #b82e24;
  }
}
</style>
