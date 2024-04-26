import { useSelector } from "react-redux";
//Dosya ekleme inputunun şekli hoşumuza gitmedi. Ve avatara referans vermek oraya tıklayınca dosya ekleme açılması için bu yöntemi kullanacağız.
import { useEffect, useRef, useState } from "react";
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from "firebase/storage";
import { app } from "../firebase";
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined); //undefined olarak tanımlandı çünkü elimizde hiçbir şey yok. seçim yok.
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});

  /* console.log(formData);
  console.log(filePerc);
  console.log(fileUploadError); */

  //firebase storage
  /*  allow read;
  allow write: if
  request.resource.size < 2 * 1024 * 1024 &&
  request.resource.contentType.matches('image/.*') */

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app); //bu app değişkeni firebase.js dosyasından geliyor.
    const fileName = new Date().getTime + file.name; //bu sayede her zaman unique bir dosya adı oluşacak. Çünkü yüklendiği zamanı alıyor bir de dosya adını
    //const storageRef = ref(storage, `avatars/${fileName}`); //böyle de belirtebilirdik. Ama gerek duymadı.
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef,file); //Yükleme yüzdesini gösterecek.

    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
        setFilePerc(Math.round(progress));
      },
      (error)=>{
        setFileUploadError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL)=>{
          setFormData({...formData,avatar:downloadURL});
        })
      }
    )
  
  };

  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        {/* file inputunun işlevlerini avatar resmine referansladık. Böylece resme tıklayınca dosya ekleme penceresi açılıyor. */}
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
          <span>Error Image Upload
            (image must be less than 2mb)
          </span> 
          
          ):
          filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePerc}%`}
            </span>
          ): filePerc ===100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ): (
            ''
          )}
        </p>
        {/* self-center görüntüyü ortaya getirdi.ana kapsayıcı flex olması lazım ama */}
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out </span>
      </div>
    </div>
  );
}
