import { computed } from "vue";

export function useAuthFormModels(isLogin, loginForm, registerForm) {
  const emailModel = computed({
    get: () =>
      isLogin.value ? loginForm.value.email : registerForm.value.email,
    set: (val) => {
      if (isLogin.value) loginForm.value.email = val;
      else registerForm.value.email = val;
    }
  });

  const passwordModel = computed({
    get: () =>
      isLogin.value ? loginForm.value.password : registerForm.value.password,
    set: (val) => {
      if (isLogin.value) loginForm.value.password = val;
      else registerForm.value.password = val;
    }
  });

  const nameModel = computed({
    get: () => registerForm.value.name,
    set: (val) => {
      registerForm.value.name = val;
    }
  });

  const confirmPasswordModel = computed({
    get: () => registerForm.value.confirmPassword,
    set: (val) => {
      registerForm.value.confirmPassword = val;
    }
  });

  return {
    emailModel,
    passwordModel,
    nameModel,
    confirmPasswordModel
  };
}
