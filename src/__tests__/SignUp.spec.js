import React from "react";
import { render, cleanup, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import regeneratorRuntime from "regenerator-runtime";
import axios from 'axios';

import SignUp from "../components/SignUp";

afterEach(cleanup);

jest.mock('axios');

describe("App", () => {

    // https://github.com/jsdom/jsdom/issues/1937
    let emit;

    beforeAll(() => {
        ({ emit } = window._virtualConsole);
    });

    beforeEach(() => {
        window._virtualConsole.emit = jest.fn();
    });

    afterAll(() => {
        window._virtualConsole.emit = emit;
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe("Display", () => {

        it("displays SignUp Page", () => {
            const { getByText } = render(<SignUp />);
            expect(getByText("SignUp Your Account!")).toBeInTheDocument();
        });

        it("displays email label", () => {
            const { getByText } = render(<SignUp />);
            expect(getByText("email:")).toBeInTheDocument();
        });

        it("is able to input email", () => {
            const { getByPlaceholderText } = render(<SignUp />);
            expect(getByPlaceholderText("Input Your Email Address")).toBeInTheDocument();
        });

        it("displays password label", () => {
            const { getByText } = render(<SignUp />);
            expect(getByText("password:")).toBeInTheDocument();
        });

        it("is able to input password", () => {
            const { getByPlaceholderText } = render(<SignUp />);
            expect(getByPlaceholderText("Password")).toBeInTheDocument();
        });

        it("displays signup Button", () => {
            const { getByText } = render(<SignUp />);
            expect(getByText("SignUp")).toBeInTheDocument();
        });
    });

    describe("execute",  () => {
        it("call post for signup", async () => {

            const spy = await jest.spyOn(axios, 'post').mockImplementation(() => {
                return Promise.resolve('result of axios post')
            });

            const { getByText, getByPlaceholderText } = await render(<SignUp />);
            await fireEvent.change(getByPlaceholderText("Input Your Email Address"), {target: {value: 'inputEmail'}})
            await fireEvent.change(getByPlaceholderText("Password"), {target: {value: 'inputPassword'}})
            await fireEvent.click(getByText("SignUp"))

            await expect(spy).toHaveBeenCalledWith('http://localhost:3003/api/v1/auth/signup', {
                email: 'inputEmail',
                password: 'inputPassword'
            });
        });
    });
});