<!--
  LoginView.vue
  --------------------------------------------------
  User authentication view for Geirangerfjorden Feriesenter:
    • Renders a centered login card with email and password fields.
    • Validates input: ensures a valid email and minimum password length.
    • Handles form submission: displays loading state and shows error messages for common auth failures.
    • On successful login, redirects the user to the "Books" route.
    • Styled responsively with full-screen background image.
-->
<template>
  <div class="login-view" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <el-card class="login-card" style="width: 360px;">
      <h2 style="text-align: center;">Geirangerfjorden Feriesenter</h2>
      <el-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        :validate-on-rule-change="false"
        @submit.prevent="onSubmit"
        label-position="top"
      >
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="form.email" autocomplete="username" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="current-password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%;">Log in</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default {
  name: "LoginView",
  setup() {
    const auth = useAuthStore();
    const router = useRouter();
    const form = ref({ email: "", password: "" });
    const loading = ref(false);
    const loginForm = ref(null);

    const rules = {
      email: [
        { type: "email", message: "Incorrect e-mail address" }
      ],
      password: [
        { min: 6, message: "Password must be at least 6 characters long" }
      ]
    };

    const onSubmit = () => {
      loginForm.value.validate(async valid => {
        if (!valid) return;
        loading.value = true;
        try {
          await auth.signIn(form.value.email, form.value.password);
          router.push({ name: "Books" });
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            ElMessage.error('Account does not exist');
          } else if (error.code === 'auth/wrong-password') {
            ElMessage.error('Wrong password');
          } else {
            ElMessage.error(error.message || 'Log in failed');
          }
        } finally {
          loading.value = false;
        }
      });
    };

    return { form, rules, loginForm, loading, onSubmit };
  }
};
</script>

<style scoped>
.login-card {
  padding: 20px;
}

.login-view {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/camping.png');
  background-size: cover;
  background-position: center;
}
</style>