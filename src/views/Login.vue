<script setup>
import { ref } from 'vue'
import { useStore } from '@/stores/store'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import router from '@/router/index'

const store = useStore()
const email = ref('')
const password = ref('')
const hasError = ref(false)

function login(e) {
  e.preventDefault()

  const auth = getAuth()

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      store.uid = data.user.uid
      router.push('/data')
    })
    .catch((error) => {
      hasError.value = true
      router.push('/login')
      console.log('Login Error', error)
    })
}

function loginAsGuest() {
  store.uid = 'testuser'
  router.push('/data')
}
</script>

<template>
  <div>
    <div class="box login">
      <div class="box-headline">Login</div>
      <form @submit="login">
        <p v-if="hasError" class="errors">
          Login fehlgeschlagen. Bitte überprüfen Sie E-Mail und Passwort oder fahren Sie als Gast
          fort.
        </p>
        <p>
          <input type="text" placeholder="E-Mail" v-model="email" />
        </p>
        <p>
          <input type="password" placeholder="Password" v-model="password" />
        </p>
        <button class="button w-full large">Einloggen</button>
      </form>
    </div>

    <div class="box guests">
      <div class="box-headline">Keine Zugangsdaten?</div>
      <p>Interessierte Besucher können sich das Projekt über den Gastzugang ansehen.</p>
      <button @click="loginAsGuest" class="button w-full large">Als Gast fortfahren</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.box {
  max-width: 28rem;
  margin: 2rem auto 0;
  padding: 1.25rem;
  background-color: #fff;
  border-radius: 0.25rem;

  .box-headline {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  &.guests {
    margin-bottom: 2rem;
  }
}

.errors {
  margin-bottom: 1rem;
  padding: 1.25rem;
  border: 1px solid $red-700;
  background-color: $red-100;
  border-radius: 0.25rem;
}
</style>
