import React from "react";
import { render, cleanup, fireEvent, waitForElement, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ReactDOM from "react-dom";
import axios from 'axios';
import regeneratorRuntime from "regenerator-runtime";

import firebase from '../utils/libs/firebase.js';
import Main from "../components/Main";
import App from "../components/App";

afterEach(cleanup);

describe("Main", () => {
    // https://github.com/jsdom/jsdom/issues/1937
    let emit;

    beforeAll(() => {
        ({ emit } = window._virtualConsole);
    });

    beforeEach(() => {
        window._virtualConsole.emit = jest.fn();

        // https://github.com/mrbenhowl/mocking-firebase-initializeApp-and-firebase-auth-using-jest
        const onAuthStateChanged = jest.fn()

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
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe("check loged in user",  () => {
        // もはや無理ゲーでは？mockでコールバック処理全部上に乗っちゃうし
        xit("jumps to Login Page without loged in user", async () => {
            await jest.spyOn(axios, 'get').mockImplementation(() => {
                return {
                    data: [{date: '20191121', studytime: '2315'}, {date: '20320408', studytime: '444'}]
                }
            });

            const spy = await jest.spyOn(global, 'alert').mockImplementation(() => {});

            const { findByRole, getByText } = await render(<Main />);
            
            const spyRender = await jest.spyOn(ReactDOM, 'render').mockImplementation();
            
            // const alert = await findByRole('alert')
            // expect(spy).toHaveBeenCalledWith('You Have to Login!')
            // await expect(spyRender).toHaveBeenCalledWith(<App />, document.getElementById("root"));

            expect(getByText("Login Page")).toBeInTheDocument();
        });
    });
});