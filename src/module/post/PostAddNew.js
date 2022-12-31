import { Button } from "~/components/button";
import { Field } from "~/components/field";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Radio } from "~/components/checkbox";
import { Dropdown, List, Option, Select } from "~/components/dropdown";
import slugify from "slugify";
import { postStatus } from "~/utils/constants";

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import ImageUpload from "~/components/image/ImageUpload";
import { useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "~/components/firebase/firebase-config";
import Toggle from "~/components/toggle/Toggle";
import { useEffect } from "react";
import { useAuth } from "~/contexts/auth-context";
import { toast } from "react-toastify";

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
    const { userInfo } = useAuth();
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState("");
    const { control, watch, setValue, handleSubmit, getValues, reset } =
        useForm({
            mode: "onChange",
            defaultValues: {
                title: "",
                slug: "",
                status: 2,
                categoryId: "",
                hot: false,
                image: "",
            },
        });
    const watchStatus = watch("status");
    const watchHot = watch("hot");
    // console.log("PostAddNew ~ watchCategory", watchCategory);

    const addPostHanler = async (values) => {
        const cloneValues = { ...values };
        cloneValues.slug = slugify(values.slug || values.title, {
            lower: true,
        });
        cloneValues.status = Number(values.status);
        const colRef = collection(db, "posts");
        await addDoc(colRef, {
            ...cloneValues,
            image,
            userId: userInfo.uid,
        });
        toast.success("Create new post successfully");
        reset({
            title: "",
            slug: "",
            status: 2,
            categoryId: "",
            hot: false,
            image: "",
        });
        setSelectCategory({});
    };

    const handleUploadImage = (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progressPercent =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progressPercent);
                // snapshot.state: trạng thái hình ảnh
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        console.log("Nothing at all");
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors

                console.log("Error");
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImage(downloadURL);
                });
            }
        );
    };

    const onSelectImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue("image_name", file.name);
        handleUploadImage(file);
    };

    const handleDeleteImage = () => {
        const storage = getStorage();

        // Create a reference to the file to delete
        const imageRef = ref(storage, "images/" + getValues("image_name"));

        // Delete the file
        deleteObject(imageRef)
            .then(() => {
                setImage("");
                console.log("Remove image successfully");
                setProgress(0);
            })
            .catch((error) => {
                console.log("Uh-oh, an error occurred!");
            });
    };

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function getData() {
            const colRef = collection(db, "categories");
            const q = query(colRef, where("status", "==", 1));
            const querySnapshot = await getDocs(q);
            let results = [];
            querySnapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategories(results);
        }
        getData();
    }, []);
    const [selectCategory, setSelectCategory] = useState("");
    const handleClickOption = (item) => {
        setValue("categoryId", item.id);
        setSelectCategory(item);
    };
    return (
        <PostAddNewStyles>
            <h1 className="dashboard-heading">Add new post</h1>
            <form onSubmit={handleSubmit(addPostHanler)}>
                <div className="grid grid-cols-2 mb-10 gap-x-10">
                    <Field>
                        <Label>Title</Label>
                        <Input
                            control={control}
                            placeholder="Enter your title"
                            name="title"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input
                            control={control}
                            placeholder="Enter your slug"
                            name="slug"
                        ></Input>
                    </Field>
                </div>
                <div className="grid grid-cols-2 mb-10 gap-x-10">
                    <Field>
                        <Label>Image</Label>

                        <ImageUpload
                            className="h-[250px]"
                            onChange={onSelectImage}
                            progress={progress}
                            image={image}
                            handleDeleteImage={handleDeleteImage}
                        ></ImageUpload>
                    </Field>
                    <Field>
                        <Label>Category</Label>
                        <Dropdown>
                            <Select
                                placeholder={"Select the category"}
                            ></Select>
                            <List>
                                {categories.length > 0 &&
                                    categories.map((item) => (
                                        <Option
                                            onClick={() =>
                                                handleClickOption(item)
                                            }
                                            key={item.id}
                                        >
                                            {item.name}
                                        </Option>
                                    ))}
                            </List>
                        </Dropdown>
                        {selectCategory?.name && (
                            <span className="inline-block p-4 text-xl font-medium text-green-600 rounded-lg bg-green-50">
                                {selectCategory?.name}
                            </span>
                        )}
                    </Field>
                </div>
                <div className="grid grid-cols-2 mb-10 gap-x-10">
                    <Field>
                        <Label>Feature post</Label>
                        <Toggle
                            on={watchHot === true}
                            onClick={() => setValue("hot", !watchHot)}
                        ></Toggle>
                    </Field>
                    <Field>
                        <Label>Status</Label>
                        <div className="flex items-center gap-x-5">
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.APPROVED
                                }
                                value={postStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.PENDING
                                }
                                value={postStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.REJECTED
                                }
                                value={postStatus.REJECTED}
                            >
                                Reject
                            </Radio>
                        </div>
                    </Field>
                </div>
                <Button type="submit" className="mx-auto">
                    Add new post
                </Button>
            </form>
        </PostAddNewStyles>
    );
};

export default PostAddNew;
