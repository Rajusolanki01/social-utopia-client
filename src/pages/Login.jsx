import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { BsShare } from "react-icons/bs";
import { AiOutlineInteraction } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import { CustomButton, Loading, TextInput } from "../components";
import { BgImage, BgImage2, homeLogo, socialUtopiaName } from "../assets";
import { axiosClient } from "../utils/axiosClient";
import { UserLogin } from "../redux/userSlice";

const Login = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axiosClient({
        url: "auth/login",
        data: data,
        method: "POST",
      });
      if (response?.status === "failed") {
        setErrMsg(response.data.message);
      } else {
        setErrMsg(response.data.message);
        const newData = {
          token: response?.data?.token,
          ...response?.data?.user,
        };
        dispatch(UserLogin(newData));
        window.location.replace("/");
      }
      setIsSubmitting(false);
    } catch (error) {
      const err = error.response.data;
      console.log("Detailed error:", err);
      setIsSubmitting(false);
      setErrMsg(err?.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6"
      style={{ backgroundImage: `url(${BgImage2})`, backgroundSize: "cover" }}>
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          <div className="w-full flex items-center mb-6 ">
            <div className="p-2  rounded text-white flex">
              <img src={socialUtopiaName} alt="Brand-Logo" className="w-14" />
              <img src={homeLogo} alt="" className="w-auto h-12 mt-2" />
            </div>
          </div>
          <p className="text-ascent-1 text-base font-semibold">
            Log in to your account
          </p>
          <span className="text-sm mt-2 text-ascent-2">Welcome back</span>

          <form
            className="py-8 flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              name="email"
              placeholder="email@example.com"
              label="Email Address"
              type="email"
              register={register("email", {
                required: "Email Address is Required.",
              })}
              styles="w-full rounded-full"
              labelStyle="ml-2"
              error={errors.email ? errors.email.message : ""}
            />

            <div className="relative w-full">
              <TextInput
                name="password"
                label="Password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                styles="w-full rounded-full"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password?.message : ""}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-12 right-3 transform -translate-y-3/2">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <Link
              to="/reset-password"
              className="text-sm text-right text-blue font-semibold">
              Forgot Password ?
            </Link>
            {errMsg && (
              <span
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#2ba150fe]"
                    : "text-[#f64949fe]"
                } mt-0.5`}>
                {errMsg}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type="submit"
                containerStyles={`bg-custom-gradient inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title="Login"
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            Don't have an account?
            <Link
              to="/register"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer">
              Create Account
            </Link>
          </p>
        </div>

        {/* RIGHT */}

        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-custom-gradient">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={BgImage}
              alt=""
              className="w-64 2xl:w-64 h-64 2xl:h-64 rounded-full object-cover "
            />
            <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
              <BsShare size={14} />
              <span className="text-xs font-medium">Share</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
              <ImConnection />
              <span className="text-xs font-medium">Connect</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full">
              <AiOutlineInteraction />
              <span className="text-xs font-medium">Interact</span>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-white text-base">
              Connect with friends & have share for fun
            </p>
            <span className="text-sm text-white/80">
              Share memories with friends and the world.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
