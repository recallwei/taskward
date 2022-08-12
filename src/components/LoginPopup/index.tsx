import { useEffect } from "react";
import { axiosService } from "@requests";
import { useQueryString } from "@hooks";

export default function LoginPopup(): JSX.Element {
  const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
  const REDIRECT_URL = `${import.meta.env.VITE_TASKWARD_BASE_URL}login`;
  const code = useQueryString("code");

  useEffect(() => {
    if (code) {
      loginByGitHubCode();
    }
  }, []);

  async function loginByGitHubCode() {
    let response = await axiosService({
      method: "POST",
      url: `auth/github?code=${code}`,
      headers: {
        accept: "application/json",
      },
    });
    console.log(response);
  }

  return (
    <>
      <a
        href={`${AUTHORIZE_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}`}
      >
        <h1 className="bg-white w-fit cursor-pointer rounded-md p-2 whitespace-nowrap hover:bg-slate-300">
          GitHub Login
        </h1>
      </a>
    </>
  );
}
