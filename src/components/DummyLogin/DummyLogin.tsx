import { useEffect } from "react";
import { useAsyncTask } from "shared";

export const DummyLogin = () => {
  const [
    createAccount,
    { data: dataCreateAccount, status: statusCreateAccount },
  ] = useAsyncTask(requestCreateAccount);

  const [
    login,
    { status: statusLogin, error: errorLogin },
  ] = useAsyncTask(requestLogin, { numOfRetries: 2, waitMsBeforeRetry: 500 });

  useEffect(() => {
    if (dataCreateAccount?.userId) {
      login();
    }
  }, [dataCreateAccount, login]);

  return (
    <div style={{ padding: "12px" }}>
      <div style={{ minHeight: "25px", color: "grey" }}>
        {statusCreateAccount === "pending" && <>Creating account...</>}
        {statusLogin === "pending" && <>Login...</>}
        {statusCreateAccount === "fulfilled" && statusLogin === "fulfilled" && (
          <span style={{ color: "green" }}>Logged in</span>
        )}
        {statusCreateAccount === "fulfilled" && errorLogin && (
          <span style={{ color: "red" }}>Could not login :/</span>
        )}
        {statusCreateAccount === "rejected" && (
          <span style={{ color: "red" }}>Could not create account :/</span>
        )}
      </div>
      <button
        onClick={createAccount}
        disabled={
          statusCreateAccount === "pending" || statusLogin === "pending"
        }
      >
        Skapa konto
      </button>
    </div>
  );
};

const requestCreateAccount = (): Promise<{ userId: string }> =>
  new Promise((res, rej) => {
    console.log("request createAccount");
    return setTimeout(() => {
      res({ userId: "Account id" });
    }, 500);
  });

const requestLogin = async (): Promise<{ loginId: string }> => {
  await requestLoginTicket();
  await requestLoginToken();
  return requestLoginWithToken();
};

const requestLoginTicket = (): Promise<{ id: string }> =>
  new Promise((res, rej) => {
    console.log("request loginTicket");
    return setTimeout(() => {
      res({ id: "ticket" });
    }, 500);
  });

const requestLoginToken = (): Promise<{ id: string }> =>
  new Promise((res, rej) => {
    console.log("request loginToken");
    return setTimeout(() => {
      res({ id: "token" });
    }, 500);
  });

const requestLoginWithToken = (): Promise<{ loginId: string }> =>
  new Promise((res, rej) => {
    console.log("request loginWithToken");
    return setTimeout(() => {
      res({ loginId: "loggedIn" });
    }, 500);
  });
