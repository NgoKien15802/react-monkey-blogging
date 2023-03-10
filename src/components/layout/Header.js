import React from "react";
import { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { Button } from "~/components/button";
import { useAuth } from "~/contexts/auth-context";

const menuLinks = [
    {
        url: "/",
        title: "Home",
    },
    {
        url: "/blog",
        title: "Blog",
    },
    {
        url: "/feedback",
        title: "Feedback",
    },
];
const HeaderStyles = styled.header`
    padding: 40px 0;
    .header-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo {
        display: block;
        max-width: 50px;
    }

    .menu {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-left: 40px;
        list-style: none;
        font-weight: 500;
    }

    .search {
        position: relative;
        padding: 15px 25px;
        border: 1px solid #ccc;
        border-radius: 8px;
        width: 100%;
        max-width: 320px;
        margin-left: auto;
        display: flex;
        align-items: center;
        margin-right: 20px;
    }

    .search-input {
        flex: 1;
        padding-right: 45px;
        font-weight: 500;
    }
    .search-icon {
        position: absolute;
        top: 50%;
        right: 25px;
        transform: translateY(-50%);
    }
    .header-button {
        margin-left: 20px;
    }
`;

function getLastName(name = "") {
    const length = name.split(" ").length;
    return name.split(" ")[length - 1];
}
const Header = () => {
    const { userInfo } = useAuth();
    return (
        <HeaderStyles>
            <div className="container">
                <div className=" header-main">
                    <NavLink to={"/"} href="/">
                        <img
                            className="logo"
                            srcSet="/logo.png 2x"
                            alt="Monkey blogging"
                        />
                    </NavLink>
                    <ul className="menu">
                        {menuLinks.map((item) => (
                            <li className="menu-item" key={item.title}>
                                <NavLink
                                    to={item.url}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-green-400 menu-link"
                                            : "menu-link"
                                    }
                                >
                                    {item.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* <div className="search">
                        <input
                            placeholder="Search posts"
                            type="text"
                            className="search-input"
                        />
                        <div className="search-icon">
                            <svg
                                width="18"
                                height="17"
                                viewBox="0 0 18 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <ellipse
                                    cx="7.66669"
                                    cy="7.05161"
                                    rx="6.66669"
                                    ry="6.05161"
                                    stroke="#999999"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                                    stroke="#999999"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                                    stroke="#999999"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div> */}

                    {!userInfo ? (
                        <Button
                            className="header-button"
                            height="56px"
                            to="/sign-in"
                            type="button"
                        >
                            Sign in
                        </Button>
                    ) : (
                        <div className="flex items-center gap-x-5">
                            <Button
                                className="header-button"
                                height="56px"
                                to="/dashboard"
                                type="button"
                            >
                                Dashboard
                            </Button>
                            <div className="  items-center justify-center border border-gray-300 rounded-full header-avatar inline-flex w-[56px] h-[56px]">
                                {userInfo?.email !== "admin@admin.com" ? (
                                    <Link
                                        to={`/profile?id=${userInfo.id}`}
                                        className=""
                                    >
                                        <img
                                            className="object-cover rounded-full h-[56px] w-[56px]"
                                            src={userInfo?.avatar}
                                            alt=""
                                        />
                                    </Link>
                                ) : (
                                    <div className="header-avatar">
                                        <img
                                            className="object-cover rounded-full"
                                            src={
                                                "https://tse1.mm.bing.net/th?id=OIP.MMjgXw0k06T087lG4CcNXAHaHa&pid=Api&P=0"
                                            }
                                            alt=""
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </HeaderStyles>
    );
};

export default Header;

{
    /* <div className="header-auth">
                            <span>Welcom back,</span>
                            <strong className="text-primary">
                                {" "}
                                {getLastName(userInfo?.displayName)}
                            </strong>
                        </div> */
}
