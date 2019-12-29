import React from "react";
import { render, cleanup, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ReactDOM from "react-dom";
import regeneratorRuntime from "regenerator-runtime";
import auth from "../utils/libs/firebaseAuth"

import App from "../components/App";
import Main from "../components/Main";
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

        it("displays Login Page", () => {
            const { getByText } = render(<App />);
            expect(getByText("Record Your Study Times!")).toBeInTheDocument();
        });

        it("displays email label", () => {
            const { getByText } = render(<App />);
            expect(getByText("email:")).toBeInTheDocument();
        });

        it("is able to input email", () => {
            const { getByPlaceholderText } = render(<App />);
            expect(getByPlaceholderText("Input Your Email Address")).toBeInTheDocument();
        });

        it("displays password label", () => {
            const { getByText } = render(<App />);
            expect(getByText("password:")).toBeInTheDocument();
        });

        it("is able to input password", () => {
            const { getByPlaceholderText } = render(<App />);
            expect(getByPlaceholderText("Password")).toBeInTheDocument();
        });

        it("displays login Button", () => {
            const { getByText } = render(<App />);
            expect(getByText("Login")).toBeInTheDocument();
        });
    });

    describe("execute",  () => {

        it("executes firebase e-mail auth library and rendor Main when Login Button is clicked", async () => {
            const { getByText, getByPlaceholderText } = await render(<App />);
        
            const spyRender = jest.spyOn(ReactDOM, 'render').mockImplementation();
            const spyAuthenticator = jest.spyOn(auth, 'signInWithEmailAndPassword').mockImplementation();

            fireEvent.change(getByPlaceholderText("Input Your Email Address"), {target: {value: 'inputEmail'}})
            fireEvent.change(getByPlaceholderText("Password"), {target: {value: 'inputPassword'}})
            fireEvent.click(getByText("Login"))

            await expect(spyAuthenticator).toHaveBeenCalledWith("inputEmail", "inputPassword");
            await expect(spyRender).toHaveBeenCalledWith(<Main />, document.getElementById("root"));
        });

        it("rendor SignUp when SignUp Button is clicked", async () => {
            const { getByText } = await render(<App />);

            const spyRender = jest.spyOn(ReactDOM, 'render').mockImplementation();

            fireEvent.click(getByText("SignUp"))

            await expect(spyRender).toHaveBeenCalledWith(<SignUp />, document.getElementById("root"));
        });
    });
});