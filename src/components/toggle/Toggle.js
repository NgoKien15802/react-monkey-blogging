import React from "react";
import PropTypes from "prop-types";

const Toggle = (props) => {
    const { on, onClick, ...rest } = props;

    return (
        <label>
            <input
                type="checkbox"
                checked={on}
                className="hidden-input"
                onChange={() => {}}
                onClick={onClick}
            />
            <div
                className={`inline-block w-[70px] h-[42px] relative cursor-pointer rounded-full pt-1.5 pl-2 transition-all ${
                    on ? "bg-green-500" : "bg-gray-300"
                }`}
                {...rest}
            >
                <span
                    className={` transition-all w-[34px] h-[34px] bg-white rounded-full inline-block ${
                        on ? "translate-x-[28px]" : ""
                    }`}
                ></span>
            </div>
        </label>
    );
};

Toggle.propTypes = {
    on: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Toggle;
