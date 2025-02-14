"use client"
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import baseUrl from '@/service/BaseUrl';
import { Button } from '@/components/Button';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/layouts/Sidebar';
import { PiArrowFatLinesRightThin, PiImageThin } from 'react-icons/pi';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { UserContext } from '@/context/UserContext';

export default function WorldEdit() {

  const { token } = useContext(UserContext);

  const { id } = useParams();
  const router = useRouter();

  const [newImage, setNewImage] = useState('');

  const [loading, setLoading] = useState(true);

  const [worldField, setWorldField] = useState({
    name: '',
    description: '',
    image: '',
  });

  const changeWorldFieldHandler = (e) => {
    setWorldField({
      ...worldField,
      [e.target.name]: e.target.value
    });
  }

  const handleImageUpload = () => {
    document.getElementById('imageInput').click();
  };

  const onFileChangeImage = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
    setWorldField(prevState => ({
      ...prevState,
      image: file,
    }));
  }

  const [error, setError] = useState([]);

  useEffect(() => {
    if (token) {
      fetchWorld();
    }
  }, [id, token]);

  const fetchWorld = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/world/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setWorldField(data.world)
        setLoading(false);
      } else if (response.status === 400) {
        Swal.fire({
          icon: "error",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "มีบางอย่างผิดปกติ",
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
    }
  }

  const onSubmitChange = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('name', worldField.name);

    if (newImage) {
      formData.append('image', newImage);
    }

    formData.append('description', worldField.description);

    try {
      const response = await fetch(`${baseUrl}/api/admin/world/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
        setError([]);
        router.push('/admin/world');
      } else if (response.status === 400) {
        Swal.fire({
          icon: "success",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      } else if (response.status === 422) {
        setError(data.errors);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "มีข้อผิดพลาดกับดึงข้อมูล",
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
    }
  }

  return (
    <Sidebar header={`โลก (แก้ไข)`}>

      <form onSubmit={onSubmitChange}>

        <div className="flex flex-col md:flex-row gap-2 w-full">

          <div className={`basis-1/2`}>
            <label>รูปโลก</label>
            <div className="h-[16rem] p-[0.15rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
              <div
                className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={handleImageUpload}
              >
                <div className="flex flex-col items-center text-white text-xl">
                  รูปภาพ
                  <PiImageThin size={40} />
                </div>
              </div>
              {newImage ? (
                <img className={`w-full h-full object-cover`} src={URL.createObjectURL(newImage)} alt={`อัพโหลดรูปภาพ`} />
              ) : worldField.image ? (
                <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/world/${worldField.slug}/${worldField.image}`} alt={`รูปภาพของ ${worldField.name}`} />
              ) : (
                <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
              )}
            </div>

            <Button name={`อัพโหลดรูปภาพ`} icon={<PiImageThin size={25} />} className={`w-full mt-2`} onClick={handleImageUpload} />

            <input hidden id="imageInput" type="file" onChange={onFileChangeImage} />
            {error && error.image && (
              <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                {error.image}
              </div>
            )}
          </div>

          <div className="basis-1/2">
            <div className="mb-2">
              <label>ชื่อโลก</label>
              <Input
                type={`text`}
                name="name"
                id="name"
                value={worldField.name}
                placeholder={`ชื่อโลก`}
                onChange={e => changeWorldFieldHandler(e)} />
              {error && error.name && (
                <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                  {error.name}
                </div>
              )}
            </div>

            <div className={`mb-2`}>
              <label>รายละเอียดโลก</label>
              <Textarea
                type={`text`}
                name="description"
                id="description"
                value={worldField.description}
                placeholder={`รายละเอียดโลก`}
                onChange={e => changeWorldFieldHandler(e)} />
              {error && error.description && (
                <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                  {error.description}
                </div>
              )}
            </div>

          </div>

        </div>
        <div className="flex items-center justify-end">
          <Button name={`บันทึก`} type={`submit`} icon={<PiArrowFatLinesRightThin size={25} />} />
        </div>

      </form>

    </Sidebar>

  )
}
