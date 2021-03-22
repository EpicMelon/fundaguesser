import React from 'react'

import { useForm } from "react-hook-form";
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH } from "../../context/config";

function SetName({ onNameSubmission }) {
    const { register, handleSubmit, watch, errors } = useForm();

    return (
        <div>
            <form onSubmit={handleSubmit(onNameSubmission)}>
                <div className="setNameDiv">
                    <input name="name" ref={
                        register({required: true, minLength: MIN_NAME_LENGTH, maxLength: MAX_NAME_LENGTH}
                            )}
                    placeholder={"Your Name"} type="text" maxLength={MAX_NAME_LENGTH} autoComplete="off"
                    className="whiteWrite setNameWrite"/>
                    <input type="submit" value="Play"  className="blueButton setNameButton"/>
                </div>
            </form>
        </div>
    )
}

export default SetName
