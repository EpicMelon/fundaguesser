import React from 'react'

import { useForm } from "react-hook-form";
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH } from "../../context/config";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function SetName({ onNameSubmission }) {
    const { register, handleSubmit, watch, errors } = useForm();

    return (
        <div>
            <form onSubmit={handleSubmit(onNameSubmission)}>
                <div className="setNameDiv">
                    <TextField name="name" ref={
                        register({required: true, minLength: MIN_NAME_LENGTH, maxLength: MAX_NAME_LENGTH}
                            )}
                    placeholder={"Your Name"} type="text" maxLength={MAX_NAME_LENGTH} autoComplete="off"
                    className="whiteWrite setNameWrite"/>
                    <Button type="submit" size="large" variant="contained" color="primary"> Join Game </Button>
                </div>
            </form>
        </div>
    )
}

export default SetName
