<template>
  <div>
    <h1>
      Client Fetch
    </h1>
    <p>
      The following requires a client side token which we store in memory here. Thus the token is destroyed on page reload.
      Note that token persistance should follow best authentication practices.
    </p>

    <div v-if="!!token">
      <h2 style="overflow-wrap: anywhere;">
        {{ userResult }}
      </h2>
      <p style="text-decoration: underline;">Auth Token</p>
      <p style="overflow-wrap: anywhere;">
        {{ token }}
      </p>
      <button @click.prevent="logout">
        Logout
      </button>
    </div>
    <div v-else>
      <h2>SignUp</h2>
      <form @submit.prevent="signup">
        <label for="signin-username">Username</label>
        <input v-model="usernameSignup" type="text" id="signin-username" name="username" autocomplete="username"><br><br>
        <label for="signin-password">Password</label>
        <input v-model="passwordSignup" type="password" id="signin-password" name="password" autocomplete="current-password"><br><br>
        <label hidden for="signin-submit">Submit</label>
        <input type="submit" id="signin-submit" value="Submit"><br><br>
      </form>
      <div v-if="signinText">{{ signinText }}</div>
      <br>
  
      <h2>SignIn</h2>
      <form @submit.prevent="signin">
        <label for="signup-username">Username</label>
        <input v-model="usernameSignin" type="text" id="signup-username" name="username" autocomplete="username"><br><br>
        <label for="signup-password">Password</label>
        <input v-model="passwordSignin" type="password" id="signup-password" name="password" autocomplete="current-password"><br><br>
        <label hidden for="signup-submit">Submit</label>
        <input type="submit" id="signup-submit" value="Submit"><br><br>
      </form>
      <div v-if="signinText">{{ signinText }}</div>
      <h2>
      </h2>
      <br><br>
    </div>

    <div v-if="errorString" style="color: red;">
      {{ errorString }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const usernameSignin = ref<string>()
const passwordSignin = ref<string>()
const signinText = ref<string>()
const usernameSignup = ref<string>()
const passwordSignup = ref<string>()

const clientSurreal = new MySurreal(useRuntimeConfig().public.surrealUrl)
const helloWorldResult = ref<string>()
const userResult = ref<User>()
const token = ref<string>()
const errorString = ref<string>()

async function signup() {
  try {
    errorString.value = undefined
    const config = useRuntimeConfig().public
    const surrealdb = await clientSurreal.surrealdb()
    token.value = await surrealdb.signup({
      namespace: config.surrealNamespace,
      database: config.surrealDatabase,
      access: config.surrealAccess,
      variables: {
        username: usernameSignup.value,
        pass: passwordSignup.value,
      },
    })
    clearForm()
  } catch (error) {
    if (error instanceof Error) errorString.value = error.message
    errorString.value = error as unknown as string
  }
}

async function signin() {
  try {
    errorString.value = undefined
    const config = useRuntimeConfig().public
    const surrealdb = await clientSurreal.surrealdb()
    token.value = await surrealdb.signin({
      namespace: config.surrealNamespace,
      database: config.surrealDatabase,
      access: config.surrealAccess,
      variables: {
        username: usernameSignin.value,
        pass: passwordSignin.value,
      },
    })
    clearForm()
  } catch (error) {
    if (error instanceof Error) errorString.value = error.message
    errorString.value = error as unknown as string
  }
}

async function clientHelloWorld() {
  try {
    errorString.value = undefined
    const surrealdb = await clientSurreal.surrealdb()
    const helloWorldQuery = `RETURN "Hello World from Client Fetch From SurrealDB";`
    const [res] = await surrealdb.query<[string]>(helloWorldQuery)
    helloWorldResult.value = res
  } catch (error) {
    if (error instanceof Error) errorString.value = error.message
    errorString.value = error as unknown as string
  }
}

async function getUser() {
  try {
    errorString.value = undefined
    const surrealdb = await clientSurreal.surrealdb()
    const [user] = await surrealdb.query<[User]>(`SELECT * FROM User;`)
    userResult.value = user
  } catch (error) {
    if (error instanceof Error) errorString.value = error.message
    errorString.value = error as unknown as string
  }
}

watch((token), async (value) => {
  if (value) {
    clientHelloWorld()
    getUser()
  }
})

function clearForm() {
  usernameSignup.value = undefined
  passwordSignup.value = undefined
  usernameSignin.value = undefined
  passwordSignin.value = undefined
}

function logout() {
  token.value = undefined
  clearForm()
}
</script>

<style></style>
