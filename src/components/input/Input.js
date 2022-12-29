import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import { IconEyeOpen } from "~/components/icon";

const InputStyles = styled.div`
    position: relative;
    width: 100%;
    input {
        width: 100%;
        padding: 20px;
        padding: ${(props) => (props.hasIcon ? "20px 60px 20px 20px" : "20px")};
        background-color: ${(props) => props.theme.grayLight};
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.2s linear;
        border: 1px solid transparent;
    }

    input:focus {
        background-color: #fff;
        border-color: ${(props) => props.theme.primary};
    }

    input::placeholder {
        color: #84878b;
    }

    .icon-eye {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
`;

const Input = ({
    name = "",
    type = "",
    children,
    hasIcon = false,
    control,
    ...props
}) => {
    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });
    return (
        <InputStyles hasIcon={hasIcon}>
            <input id={name} type={type} {...field} {...props}></input>
            {hasIcon ? <IconEyeOpen className="icon-eye"></IconEyeOpen> : null}
        </InputStyles>
    );
};

export default Input;
