import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TopBar,
  ProfileCard,
  FriendsCard,
  CustomButton,
  EditProfile,
  Loading,
  PostCard,
  TextInput,
} from "../components";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import {
  SendFriendRequest,
  axiosClient,
  deletePost,
  fetchPosts,
  getUserInfo,
  handleFileUpload,
  likePost,
} from "../utils/axiosClient";
import { UserLogin } from "../redux/userSlice";

const FilePreview = ({ file }) => {
  if (!file) {
    return null;
  }

  const fileType = file.type.split("/")[0];

  switch (fileType) {
    case "image":
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="max-w-full h-auto rounded"
        />
      );
    case "video":
      return (
        <video
          src={URL.createObjectURL(file)}
          alt="Preview"
          controls
          className="max-w-full h-auto rounded"
        />
      );
    case "application":
    case "audio":
    default:
      return <p>File type not supported</p>;
  }
};

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentFriendRequests, setSentFriendRequests] = useState(() => {
    const storedRequests = localStorage.getItem("sentFriendRequests");
    return storedRequests ? JSON.parse(storedRequests) : [];
  });

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    setLoading(true);
    setErrMsg("");

    try {
      const uri = file && (await handleFileUpload(file));

      const newData = uri ? { ...data, image: uri } : data;

      const response = await axiosClient({
        url: "/posts/create-post",
        data: newData,
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response?.data?.status === "failed") {
        setErrMsg(response?.data?.error?.message);
      } else {
        reset({
          description: "",
        });
        setFile(null);
        setErrMsg("");
        await fetchingPost();
      }
    } catch (error) {
      const err = error.response?.data;
      console.log(err);
      setErrMsg(err?.message);
      setLoading(false);
    }
  };

  const fetchingPost = async () => {
    try {
      await fetchPosts(user?.token, dispatch);

      setLoading(false);
    } catch (error) {
      const err = error.response?.data;
      console.error("Detailed error:", err);
      setErrMsg(err?.message);
      setLoading(false);
    }
  };

  const handleLikePost = async (uri) => {
    await likePost(user?.token, uri);
    await fetchingPost();
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await deletePost(user?.token, id);
      setLoading(true);
      if (response?.data?.success === "failed") {
        setErrMsg(response?.data?.message);
      } else {
        setErrMsg(response?.data?.message);
      }
      await fetchingPost();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axiosClient({
        url: "users/get-friend-request",
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setFriendRequest(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuggestedFriends = async () => {
    try {
      const response = await axiosClient({
        url: "users/Suggested-friends",
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setSuggestedFriends(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      const response = await SendFriendRequest(user?.token, id);
      if (response?.data?.success === "failed") {
        setErrMsg(response?.data?.message);
      } else {
        setErrMsg(response?.data?.message);

        // Update sentFriendRequests state
        setSentFriendRequests((prevRequests) => [...prevRequests, id]);

        // Store in local storage
        localStorage.setItem(
          "sentFriendRequests",
          JSON.stringify([...sentFriendRequests, id])
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccepatFriendRequest = async (id, status) => {
    try {
      const response = await axiosClient({
        url: "/users/accept-request",
        method: "POST",
        data: { rid: id, status },
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setFriendRequest(response?.data?.data);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    const response = await getUserInfo(user?.token);
    const newUserData = { token: user?.token, ...response };
    dispatch(UserLogin(newUserData));
  };

  useEffect(() => {
    setLoading(true);
    getUser();
    fetchingPost();
    fetchFriendRequests();
    fetchSuggestedFriends();
  }, []);

  return (
    <>
      <div className="w-full px-0 lg:px-3 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />

        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>
          {/* CENTER */}
          <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className="bg-primary px-4 rounded-lg"
            >
              <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover"
                />
                <TextInput
                  styles="w-full rounded-full "
                  placeholder="What's on your mind...."
                  name="description"
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg && (
                <span
                  role="alert"
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#2ba150fe]"
                      : "text-[#f64949fe]"
                  } mt-0.5`}
                >
                  {errMsg}
                </span>
              )}

              {/* File Preview */}
              <div className="mt-4">
                <FilePreview file={file} />
              </div>

              <div className="flex items-center justify-between py-4">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="imgUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  htmlFor="videoUpload"
                >
                  <input
                    type="file"
                    data-max-size="5120"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="videoUpload"
                    accept=".mp4, .wav"
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  htmlFor="vgifUpload"
                >
                  <input
                    type="file"
                    data-max-size="5120"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="vgifUpload"
                    accept=".gif"
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>

                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      title="Post"
                      containerStyles="bg-custom-gradient text-white py-2 px-6 rounded-full font-semibold text-sm"
                    />
                  )}
                </div>
              </div>
            </form>

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDeletePost}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>
          {/* RIGHT */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            {/* Friend Request */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Friend Request</span>
                <span className="w-6 h-6 rounded-full  px-2 py-1.3 bg-custom-gradient text-white text-sm">
                  {friendRequest?.length}
                </span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-3">
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <Link
                      to={"/profile" + from._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.firstName}
                        className="w-10 h-10 oject-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {from?.firstName} {from?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {from?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>
                    <div className="flex gap-1">
                      <CustomButton
                        title="Accept"
                        onClick={() =>
                          handleAccepatFriendRequest(_id, "Accepted")
                        }
                        containerStyles="bg-custom-gradient  text-xs text-white px-2.5 py-1 rounded-full"
                      />
                      <CustomButton
                        title="Deny"
                        onClick={() =>
                          handleAccepatFriendRequest(_id, "Denied")
                        }
                        containerStyles="border border-[#666] text-xs text-ascent-1 px-2.5 py-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Suggested Friends */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
              <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
                <span>Friend Suggestion</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-3">
                {suggestedFriends?.map((friend) => (
                  <div
                    className="flex items-center justify-between"
                    key={friend._id}
                  >
                    <Link
                      to={"/profile/" + friend?._id}
                      key={friend?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1 ">
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      {sentFriendRequests.includes(friend._id) ? (
                        <span className="text-sm text-ascent-2">
                          Request Sent
                        </span>
                      ) : (
                        <button
                          className="bg-[#0444a430] text-sm text-white p-1 rounded"
                          onClick={() => handleFriendRequest(friend?._id)}
                        >
                          <BsPersonFillAdd
                            size={20}
                            className="text-[#0f52b6]"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {edit && <EditProfile />}
    </>
  );
};

export default Home;
