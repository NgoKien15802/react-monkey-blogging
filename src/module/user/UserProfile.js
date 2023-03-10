import { Button } from "~/components/button";
import { Field } from "~/components/field";
import ImageUpload from "~/components/image/ImageUpload";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import DashboardHeading from "~/module/dashboard/DashboardHeading";
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "~/contexts/auth-context";
import { useEffect } from "react";
import useFirebaseImage from "~/hooks/useFireBaseImage";
import { auth, db } from "~/components/firebase/firebase-config";
import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useState } from "react";
import { onAuthStateChanged, updatePassword } from "firebase/auth";
import axios from "axios";
import slugify from "slugify";
import { useSearchParams } from "react-router-dom";
import { Textarea } from "~/components/textarea";

const UserProfile = () => {
    const { userInfo } = useAuth();
    const [params] = useSearchParams();
    const userId = params.get("id");
    const [user, setUser] = useState([]);
    const {
        control,
        reset,
        setValue,
        getValues,
        handleSubmit,
        watch,
        formState: { isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {},
    });

    const watchPassword = watch("password");
    const watchConfirmPassword = watch("confirmPassword");

    const imageURL = userInfo.avatar;
    const imageRegex = imageURL && /%2F(\S+)\?/gm.exec(imageURL);
    const image_name = imageRegex && imageRegex[1];

    // const deleteAvatar = async () => {
    //     const docRef = doc(db, "users", user[0].id);
    //     await updateDoc(docRef, {
    //         avatar: "",
    //     });
    // };
    const {
        image,
        setImage,
        progress,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    } = useFirebaseImage(setValue, getValues, image_name);
    useEffect(() => {
        async function fetchData() {
            const response = await axios(
                `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/users/${userId}`
            );
            reset(response.data.data);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setImage(imageURL);
    }, [setImage, imageURL]);

    const handleUpdateUser = async (values) => {
        if (!isValid) return;
        if (watchPassword !== watchConfirmPassword) {
            toast.error(
                "password and confirm Password don't match, enter again please"
            );
            return;
        }
        try {
            const cloneValues = { ...values };
            cloneValues.username = slugify(values.username || values.fullname, {
                lower: true,
                replacement: "-",
                trim: true,
            });
            const data = {
                fullname: values.fullname,
                email: values.email,
                password: values.password,
                username: cloneValues.username,
                avatar: image,
                status: userInfo.status,
                role: userInfo.role,
                description: values.description,
                dateOfBirth: values.dateOfBirth,
                mobileNumber: values.mobileNumber,
            };

            const formDataJsonString = JSON.stringify(data);

            const fetchOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: formDataJsonString,
            };

            const response = await fetch(
                `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/users/update/${userId}`,
                fetchOptions
            );

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            onAuthStateChanged(auth, (user) => {
                updatePassword(user, values.password);
            });
            toast.success("Update user information successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Update user information failed!");
        }
    };
    useEffect(() => {
        function fetchData() {
            if (userInfo.email) {
                const docRef = query(
                    collection(db, "users"),
                    where("email", "==", userInfo.email)
                );
                onSnapshot(docRef, (onsnapshot) => {
                    const results = [];
                    onsnapshot.forEach((doc) => {
                        results.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                        setUser(results);
                    });
                });
            }
        }
        fetchData();
    }, [userInfo.email]);
    if (!userInfo) return;

    return (
        <div>
            <DashboardHeading
                title="Account information"
                desc="Update your account information"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateUser)}>
                <div className="mb-10 text-center">
                    <ImageUpload
                        image={image}
                        progress={progress}
                        onChange={handleSelectImage}
                        handleDeleteImage={handleDeleteImage}
                        className="w-[200px] h-[200px] !rounded-full min-h-0 mx-auto"
                    ></ImageUpload>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <Input
                            control={control}
                            name="fullname"
                            placeholder="Enter your fullname"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <Input
                            control={control}
                            name="username"
                            placeholder="Enter your username"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Date of Birth</Label>
                        <Input
                            control={control}
                            name="dateOfBirth"
                            placeholder="dd/mm/yyyy"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Mobile Number</Label>
                        <Input
                            control={control}
                            name="mobileNumber"
                            placeholder="Enter your phone number"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Email</Label>
                        <Input
                            disabled={true}
                            control={control}
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                        ></Input>
                    </Field>
                    <Field></Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>New Password</Label>
                        <Input
                            control={control}
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Confirm Password</Label>
                        <Input
                            control={control}
                            name="confirmPassword"
                            type="password"
                            placeholder="Enter your confirm password"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Description</Label>
                        <Textarea
                            control={control}
                            name="description"
                            type="description"
                            placeholder="Enter your description"
                        ></Textarea>
                    </Field>
                </div>
                <Button
                    kind="primary"
                    type="submit"
                    className="mx-auto w-[200px]"
                >
                    Update
                </Button>
            </form>
        </div>
    );
};

export default UserProfile;
