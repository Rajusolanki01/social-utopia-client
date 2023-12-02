import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { homeLogo } from "../assets";
import { fetchPosts } from "../utils/axiosClient";

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    await fetchPosts(user?.token, dispatch, "", data);
  };

  return (
    <div className="topbar w-full flex items-center justify-between py-3 px-4 bg-primary">
      <Link to="/" className="flex gap-1 items-center">
        <div className="p-1 md:p-2  rounded text-white flex">
          <img src={homeLogo} alt="" className="w-auto h-12" />
        </div>
      </Link>

      <form
        className="hidden md:flex items-center justify-center  gap-1"
        onSubmit={handleSubmit(handleSearch)}>
        <TextInput
          placeholder="Search..."
          styles="w-[18rem] lg:w-[38rem]  rounded-full py-3 "
          register={register("search")}
        />
        <CustomButton
          title="Search"
          type="submit"
          containerStyles="bg-custom-gradient linear-gradient(40deg,#00eeff,#2f00ff 70%)] text-white px-6 py-2.5 mt-2 rounded-full"
        />
      </form>

      {/* ICONS */}
      <div className="flex gap-6 items-center text-ascent-1 text-md md:text-xl">
        <label className="switch ">
          <input
            type="checkbox"
            onChange={handleTheme}
            checked={theme === "dark"}
          />
          <span className="slider"></span>
        </label>

        <button className="hidden lg:flex button">
          <svg viewBox="0 0 448 512" className="bell ">
            <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
          </svg>
        </button>

        <div>
          <CustomButton
            onClick={() => dispatch(Logout())}
            title="Log Out"
            containerStyles="bg-[#000] text-white font-semibold text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
