//Bu dosya gmail ile hesap açmak için gerekli olan yetkilendirme kodlarını barındırıyor.

import { useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const [loading, setLoading] = useState(); //Birden fazla kez butona basma işlemini kontrol ve engellemek için oluşturdum.
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      //Pop-up açılıyor.Oradan seçilen gmail bilgilerini result değişkenine aktarıyor.
      const result = await signInWithPopup(auth, provider);

      //Gelen bilgileri gönderiyoruz.
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //result içindeki gelen bilgileri console.log ile yazdır kendin gör. Oradaki değişkenlere göre çekildi.
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      //Gönderilen bilgileri json'a çevirir.
      const data = await res.json();
      dispatch(signInSuccess(data)); //Bu bizim hazırladığımız hata alma fonksiyonu. Provider olarak yaptık.
      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}
