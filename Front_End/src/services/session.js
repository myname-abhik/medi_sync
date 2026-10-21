import { login } from "../redux/features/userSlice";
import { hydrateUserData } from "../redux/persist";
import { sessionFromToken } from "./auth";

// Resolve the token, put the user in Redux and load that user's cart / meetings / notifications.
export const startSession = (dispatch, token) => {
  const session = sessionFromToken(token);
  if (!session) return null;
  dispatch(login(session));
  hydrateUserData(dispatch, session.user);
  return session;
};
