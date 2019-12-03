import React from "react";
import { render, cleanup, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from 'axios';
import regeneratorRuntime from "regenerator-runtime";

import Main from "../components/Main";

afterEach(cleanup);

jest.mock('axios');


describe("Main", () => {
    // https://github.com/jsdom/jsdom/issues/1937
    let emit;

    beforeAll(() => {
        ({ emit } = window._virtualConsole);
    });

    beforeEach(() => {
        window._virtualConsole.emit = jest.fn();

        const resp = {
            data: {login: 'theMistletoe', html_url: 'https://github.com/theMistletoe'}
        };
        axios.get.mockResolvedValue(resp);
    });

    afterAll(() => {
        window._virtualConsole.emit = emit;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Display", () => {

        it("displays Main Page", () => {
            const { getByText } = render(<Main />);
            expect(getByText("Do Study!!!")).toBeInTheDocument();
        });

        it("displays timer using library", async () => {
            const { getByText, getAllByTestId, findByText } = render(<Main />);
            const _ = await findByText("00:00:01")
            expect(await getByText("00:00:01")).toBeInTheDocument();
        });

        it("displays End Button", () => {
            const { getByText } = render(<Main />);
            expect(getByText("End!")).toBeInTheDocument();
        });
    });

    describe("execute",  () => {

        it("exec axios by inputed value", async () => {
            const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
                return {
                    data: {login: 'theMistletoe', html_url: 'https://github.com/theMistletoe'}
                }
            });
            
            const { getByText, getByPlaceholderText, getAllByTestId } = render(<Main />);

            fireEvent.change(getByPlaceholderText("Input GitHub Name"), {target: {value: 'theMistletoe'}})
            fireEvent.click(getByText("End!"))

            await waitForElement(() => getAllByTestId("name"));
            await waitForElement(() => getAllByTestId("url"));
            
            expect(spy).toHaveBeenCalledWith("https://api.github.com/users/theMistletoe");
            expect(getByText("theMistletoe")).toBeInTheDocument();
            expect(getByText("https://github.com/theMistletoe")).toBeInTheDocument();
        });
    });
});