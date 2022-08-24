import { store, userAction } from "@store";
import { axiosService } from "@requests";
import { LOCAL_STORAGE_TOKEN } from "@utils";
import { i18n } from "@i18n";
import { LoginFormData } from "@interfaces";

async function loginByUsername(loginFormData: LoginFormData) {
  try {
    const response = await axiosService({
      method: "POST",
      url: "auth/username/login",
      data: loginFormData,
    });
    if (response?.status === 200 && response?.data) {
      response.data.accessToken &&
        localStorage.setItem(LOCAL_STORAGE_TOKEN, response.data.accessToken);
      response.data.user &&
        store.dispatch(userAction.updateUserInfo(response.data.user));
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    history.replaceState(
      { message: i18n.t("request:LOGIN.FAILED") },
      "",
      "/login"
    );
    return false;
  }
}

export { loginByUsername };
