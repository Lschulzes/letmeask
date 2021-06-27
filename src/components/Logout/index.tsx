import { auth } from "../../services/firebase";
import "./style.scss";

type LogoutUserType = {
  userIn?: object | undefined;
  redirect?: { push: Function } | undefined;
};

export function LogoutUser(props: LogoutUserType) {
  async function loggingOut() {
    if (!props.userIn) return;
    await auth
      .signOut()
      .then(() => {
        console.log("Sign-out successful.");
      })
      .catch(() => {
        console.log("An error happened.");
      });
    !props.redirect ? window.location.reload() : props.redirect.push("/");
    window.location.reload();
  }

  return (
    <button className="logout-btn" onClick={loggingOut}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="512.000000pt"
        height="512.000000pt"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill="#737380"
          stroke="none"
        >
          <path
            d="M490 4484 c-84 -22 -209 -88 -272 -144 -76 -68 -151 -182 -185 -283
              l-28 -82 0 -1415 0 -1415 28 -82 c64 -191 205 -334 405 -412 l67 -26 1155 -3
              c818 -2 1172 0 1215 8 33 6 102 32 154 57 127 61 227 159 289 283 63 127 72
              182 72 485 0 240 -2 262 -20 292 -50 83 -165 83 -216 -1 -17 -28 -20 -61 -25
              -306 -3 -151 -10 -286 -15 -300 -50 -136 -165 -234 -303 -260 -73 -14 -2159
              -14 -2232 0 -123 23 -229 106 -283 220 l-31 65 0 1395 0 1395 31 65 c55 115
              161 197 285 220 37 7 428 10 1150 8 l1094 -3 56 -23 c74 -30 139 -82 184 -146
              63 -91 68 -121 72 -411 4 -284 8 -306 63 -338 15 -9 47 -17 70 -17 36 0 48 6
              81 39 l39 39 0 274 c0 241 -2 284 -20 352 -47 185 -171 338 -341 419 -52 25
              -118 50 -147 56 -36 8 -411 11 -1195 10 -960 0 -1151 -3 -1197 -15z"
          />
          <path
            d="M4048 3542 c-39 -23 -62 -75 -55 -125 5 -37 31 -66 349 -384 l343
            -343 -1215 0 c-1187 0 -1216 -1 -1247 -20 -44 -26 -66 -63 -66 -110 0 -47 22
            -84 66 -110 31 -19 60 -20 1247 -20 l1215 0 -348 -348 -347 -348 0 -43 c0 -50
            22 -92 60 -115 35 -20 92 -21 128 -2 15 8 230 218 478 468 357 358 453 460
            459 486 16 75 19 71 -458 550 -249 249 -464 460 -479 468 -36 19 -97 17 -130
            -4z"
          />
        </g>
      </svg>
    </button>
  );
}
