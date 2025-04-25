<template>
  <div class="login-view" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <el-card class="login-card" shadow="hover" style="width: 360px;">
      <h2 style="text-align: center;">Logg inn</h2>
      <el-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        :validate-on-rule-change="false"
        @submit.prevent="onSubmit"
        label-position="top"
      >
        <el-form-item label="E-post" prop="email">
          <el-input v-model="form.email" autocomplete="username" />
        </el-form-item>
        <el-form-item label="Passord" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="current-password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%;">Logg inn</el-button>
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
        { type: "email", message: "Ugyldig e-post" }
      ],
      password: [
        { min: 6, message: "Passord må være minst 6 tegn" }
      ]
    };

    const onSubmit = () => {
      loginForm.value.validate(async valid => {
        if (!valid) return;
        loading.value = true;
        try {
          await auth.signIn(form.value.email, form.value.password);
          router.push({ name: "Dashboard" });
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            ElMessage.error('Konto eksisterer ikke');
          } else if (error.code === 'auth/wrong-password') {
            ElMessage.error('Feil passord');
          } else {
            ElMessage.error(error.message || 'Innlogging feilet');
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
  padding: 24px;
}
</style>