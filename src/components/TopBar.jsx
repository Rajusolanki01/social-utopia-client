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
    <div className="topbar w-full flex items-center justify-between py-3 px-2 bg-primary">
      <Link to="/" className="flex gap-1 items-center">
        <div className="p-1 md:p-2  rounded text-white flex">
          <img src={homeLogo} alt="" className="w-auto h-12" />
        </div>
      </Link>

      <form
        className="hidden md:flex items-center justify-center  gap-1"
        onSubmit={handleSubmit(handleSearch)}
      >
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
      <div className="flex p-2 mt-2 gap-5 items-center text-ascent-1 text-md md:text-xl">
        <label className="switch ">
          <input
            type="checkbox"
            onChange={handleTheme}
            checked={theme === "dark"}
          />
          <span className="slider"></span>
        </label>

        <button className="hidden lg:flex button bg-custom-gradient ">
          <svg viewBox="0 0 448 512" className="bell ">
            <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
          </svg>
        </button>

        <div>
          {/* <CustomButton
            onClick={() => dispatch(Logout())}
            title="Log Out"
            containerStyles="bg-primary text-ascent-2 font-semibold text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          /> */}
          <button
            className="logout-Btn bg-custom-gradient"
            onClick={() => dispatch(Logout())}
          >
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
            </div>
            <div className="logout-text">Logout</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
