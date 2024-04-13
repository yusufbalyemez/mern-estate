/* Bu sayfanın amacı; eğer kullanıcı varsa Profil sayfasını gösteriyor yoksa da Sign İn yazısını.  */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
