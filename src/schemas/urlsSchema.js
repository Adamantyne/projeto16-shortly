import joi from "joi";

const url = /^(http|https):/;

export const shortenSchema = joi.object({
    url: joi.string().pattern(url).required()
});