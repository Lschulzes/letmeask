import { auth } from "../services/firebase";

async function useLogoutUser(user: any) {
  if (!user) return;
  await auth
    .signOut()
    .then(() => {
      console.log("Sign-out successful.");
      window.location.reload();
    })
    .catch(() => {
      console.log("An error happened.");
    });
}

export default useLogoutUser;
