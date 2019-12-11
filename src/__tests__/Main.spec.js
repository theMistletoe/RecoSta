import React from "react";
import { render, cleanup, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from 'axios';
import regeneratorRuntime from "regenerator-runtime";

import firebase from '../utils/libs/firebase.js';
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

        // https://github.com/mrbenhowl/mocking-firebase-initializeApp-and-firebase-auth-using-jest
        const onAuthStateChanged = jest.fn(() => {
            return Promise.resolve({
                user: {
                displayName: 'redirectResultTestDisplayName',
                email: 'redirectTest@test.com',
                emailVerified: true
                }
            })
        })

        const getRedirectResult = jest.fn(() => {
        return Promise.resolve({
            user: {
            displayName: 'redirectResultTestDisplayName',
            email: 'redirectTest@test.com',
            emailVerified: true
            }
        })
        })

        const sendEmailVerification = jest.fn(() => {
        return Promise.resolve('result of sendEmailVerification')
        })

        const sendPasswordResetEmail = jest.fn(() => Promise.resolve())

        const createUserWithEmailAndPassword = jest.fn(() => {
        return Promise.resolve('result of createUserWithEmailAndPassword')
        })

        const signInWithEmailAndPassword = jest.fn(() => {
        return Promise.resolve('result of signInWithEmailAndPassword')
        })

        const signInWithRedirect = jest.fn(() => {
        return Promise.resolve('result of signInWithRedirect')
        })

        const initializeApp = jest
        .spyOn(firebase, 'initializeApp')
        .mockImplementation(() => {
            return {
            auth: () => {
                return {
                createUserWithEmailAndPassword,
                signInWithEmailAndPassword,
                currentUser: {
                    sendEmailVerification
                },
                signInWithRedirect
                }
            }
            }
        })

        const getIdToken = jest.fn(() => {
            return Promise.resolve('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        })

        firebase.auth.currentUser = jest.fn(() => {
            return {getIdToken};
        })

        jest.spyOn(firebase, 'auth').mockImplementation(() => {
        return {
            onAuthStateChanged,
            currentUser: {
            displayName: 'testDisplayName',
            email: 'test@test.com',
            emailVerified: true,
            getIdToken: getIdToken
            },
            getRedirectResult,
            sendPasswordResetEmail
        }
        })

        firebase.auth.FacebookAuthProvider = jest.fn(() => {})
        firebase.auth.GoogleAuthProvider = jest.fn(() => {})

        });

    afterAll(() => {
        window._virtualConsole.emit = emit;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Display", () => {

        it("displays Main Page Label", () => {
            const { getByText } = render(<Main />);
            expect(getByText("Do Study!!!")).toBeInTheDocument();
        });

        it("displays timer", async () => {
            const { getByText, findByText } = render(<Main />);
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
            
            const spy = await jest.spyOn(axios, 'post').mockImplementation(() => {
                return Promise.resolve('result of axios post')
            });

            var now = new Date();
            var yyyymmdd = now.getFullYear()+
                ( "0"+( now.getMonth()+1 ) ).slice(-2)+
                ( "0"+now.getDate() ).slice(-2);
            
            const { getByText, getAllByTestId, findByText } = await render(<Main />);

            const _ = await findByText("00:00:01")

            await fireEvent.click(getByText("End!"))

            await waitForElement(() => getAllByTestId("message"));

            expect(firebase.auth().currentUser.getIdToken).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith('http://localhost:3003/api/v1/studytime', {
                date: yyyymmdd,
                studytime: '00:00:01'
            }, {headers: { authorization: `Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` }});
            expect(getByText("Well Done!")).toBeInTheDocument();
            expect(getByText("00:00:01")).toBeInTheDocument();
        });
    });
});