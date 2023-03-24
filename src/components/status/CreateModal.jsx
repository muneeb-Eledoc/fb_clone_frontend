import { Close, Image, VideoFile } from '@mui/icons-material'
import React, { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase'


const CreateModal = ({ showCreateModal, setShowCreateModal }) => {
    const [image, setImage] = useState(null)
    const [video, setVideo] = useState(null)

    const uploadStatus = async ()=>{
        // const res = await axios.post(`/post`, post, {
        //     headers: {
        //         token: localStorage.getItem("token")
        //     }
        // })
    }

    const handleCreateStatus = async () => {

        if (image) {
            const storageRef = ref(storage, 'media/' + new Date().getTime());
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            console.log('Upload is not running');
                            break;
                    }
                },
                (error) => {
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                    });
                }
            );
        }else if(video){

        }
    }

    return (
        <>
            <div className={showCreateModal ? 'create_modal show' : 'create_modal'}></div>
            <div className={showCreateModal ? "create_modal_container show" : "create_modal_container"}>
                <div className="create_modal_header">
                    <span>Create Status</span>
                    <div className="close" onClick={() => setShowCreateModal(prev => !prev)}>
                        <Close />
                    </div>
                </div>
                <div className="create_modal_body">
                    {!image && !video && <div className="image">
                        <label htmlFor="image">
                            <Image />
                        </label>
                        <input type="file" id='image' accept='.png, .jpg, .jpeg' onChange={(e) => setImage(e.target.files[0])} />
                    </div>}
                    {!video && !image && <div className="video">
                        <label htmlFor="video">
                            <VideoFile />
                        </label>
                        <input type="file" id='video' accept='.mp4, .mkv, .avi' onChange={(e) => setVideo(e.target.files[0])} />
                    </div>}
                    {image && <div className="preview_image">
                        <img src={URL.createObjectURL(image)} alt="" />
                        <div className="close" onClick={() => setImage(null)}>
                            <Close />
                        </div>
                    </div>}
                    {video && <div className="preview_video">
                        <video src={URL.createObjectURL(video)} controls />
                        <div className="close" onClick={() => setVideo(null)}>
                            <Close />
                        </div>
                    </div>}
                </div>
                <div className="create_modal_footer">
                    <button onClick={handleCreateStatus}>Create Status</button>
                </div>
            </div>
        </>
    )
}

export default CreateModal