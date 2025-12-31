<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useStore } from '@/stores/store'
import { useAuth } from '@/composables/use-auth'
import githubLogo from '@/assets/images/github-logo.svg'
import { getAuth, signOut } from 'firebase/auth'
import { router, publicPages } from './router'
import { LoginIcon, LogoutIcon, SettingsIcon } from 'vue-tabler-icons'
import { notify } from '@kyvg/vue3-notification'
import MainMenu from '@/components/MainMenu.vue'

const store = useStore()
const auth = getAuth()
const { isLoggedIn } = useAuth();

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
        notify({
          title: 'Es ist ein Fehler aufgetreten',
          type: 'error'
        })
      })
  }
}

onMounted(() => {
  const authRequired = !publicPages.includes(router.currentRoute.value.name as string)

  if (authRequired && !store.uid) {
    return '/login'
  }
})
</script>

<template>
  <header>
    <div class="inner">
      <a class="logo" href="/overview">
        <span class="font-color">Bill</span><span class="text-primary">Bird</span>
        <span class="version font-mono">alpha</span>
      </a>
      <div class="nav-container">
        <!--<main-menu></main-menu>-->
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
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>

  <notifications position="bottom right" classes="bb-notification" width="360px" />
</template>

<style lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


header {
  padding: 0.75rem;
  background-color: #fff;

  .inner {
    width: 100%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    gap: 1rem;

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
  // flex-grow: 1;
  align-self: flex-end;
  align-items: center;
  margin-top: 0.75rem;
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

// style of the notification
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
