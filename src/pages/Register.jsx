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

const Register = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axiosClient({
        url: "auth/register",
        data: data,
        method: "POST",
      });
      if (response?.status === "failed") {
        setErrMsg(response.data.message);
      } else {
        setErrMsg("");
        setTimeout(() => {
          window.location.replace("/#/login");
        }, 4000);
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
      className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-3"
      style={{ backgroundImage: `url(${BgImage2})`, backgroundSize: "cover" }}>
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl">
        {/* LEFT */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center ">
          <div className="w-full flex  items-center mb-6">
            <div className="p-2  rounded text-white flex">
              <img src={socialUtopiaName} alt="Brand-Logo" className="w-14" />
              <img src={homeLogo} alt="" className="w-auto h-12 mt-2" />
            </div>
          </div>

          <p className="text-ascent-1 text-base font-semibold">
            Create your account
          </p>

          <form
            className="py-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2 rounded">
              <TextInput
                name="firstName"
                label="First Name"
                placeholder="First Name"
                type="text"
                styles="w-full rounded"
                register={register("firstName", {
                  required: "First Name is required!",
                })}
                error={errors.firstName ? errors.firstName?.message : ""}
              />

              <TextInput
                label="Last Name"
                placeholder="Last Name"
                type="lastName"
                styles="w-full"
                register={register("lastName", {
                  required: "Last Name do no match",
                })}
                error={errors.lastName ? errors.lastName?.message : ""}
              />
            </div>

            <TextInput
              name="email"
              placeholder="email@example.com"
              label="Email Address"
              type="email"
              register={register("email", {
                required: "Email Address is required",
              })}
              styles="w-full"
              error={errors.email ? errors.email.message : ""}
            />

            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <div className="relative w-full">
                <TextInput
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  styles="w-full rounded"
                  register={register("password", {
                    required: "Password is required!",
                  })}
                  error={errors.password ? errors.password?.message : ""}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-12 right-1 transform -translate-y-3/2">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <TextInput
                label="Confirm Password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                styles="w-full"
                register={register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();

                    if (password !== value) {
                      return "Passwords do no match";
                    }
                  },
                })}
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>

            {errMsg && (
              <span
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? " text-[#2ba150fe]"
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
                title="Create Account"
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            Already has an account?{" "}
            <Link
              to="/login"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer">
              Login
            </Link>
          </p>
        </div>
        {/* RIGHT */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-custom-gradient">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={BgImage}
              alt=""
              className="w-64 2xl:w-64 h-64 2xl:h-64 rounded-full object-cover"
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
              Connect with friedns & have share for fun
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

export default Register;
