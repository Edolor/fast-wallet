import React, { useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../../Assets/img/google.svg";
import Input from "./../../Components/Input/Input";
import Error from "./../../Components/Input/Error";
import Label from "./../../Components/Input/Label";
import Message from '../../Components/Message/Message';
import { useAuth } from "../../Context/AuthContext/AuthContext";
import { PATHS } from "../../Routes/url";
import { useGoogleLogin } from "@react-oauth/google";
import LoginSpinner from '../../Components/Spinner/LoginSpinner';

function Register() {
  const nameRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const { postData, setToken, setLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [status, setStatus] = useState("normal");
  const [success, setSuccess] = useState(false);
  const [oauthSuccess, setOauthSuccess] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const data = {
        "code": codeResponse.code
      }

      setOauthSuccess(() => true);

      try {
        const response = await postData(data, PATHS.googleOAUTH);

        if (response.status === 200) {
          setSuccess(() => true);
          setMessage("Registration successful!");

          const token = response.data.token;
          // Storing token
          localStorage.setItem("token", token);
          setToken(() => token);
          
          // Set LoggedIn state
          setLoggedIn(() => true);
          navigate("/dashboard", {replace: true});
        }
      } catch(error) {
        setOauthSuccess(() => false);
        setError("An error occured, try again.");
        setStatus(() => "normal");
      }
    },
    onError: () => {
      setStatus(() => "normal");
      setError("An error occured, try again.");
    },
    flow: "auth-code"
  });

  const handleBlankInput = (objRef, setErrorObj, errorMessage) => {
    /**
     * objRef: Used to check the inputs value
     * setErrorObj: Used to set the error state of the input
     * errorMessage: Error message to set in state
     */
    if (objRef.current.value.trim() === "") {
      setErrorObj(() => errorMessage);
    } else {
      setErrorObj(() => "");
    }
  }

  const handleEmail = (e) => {
    /**
     * Handling email validity
     */
    const emailRegex =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    
    if (emailRef.current.value.trim() === "") {
      setEmailError(() => "Email is required");
    } else if (emailRegex.test(emailRef.current.value) === false) {
      setEmailError(() => "Invalid email address");
    } else {
      setEmailError(() => "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(() => "loading");
    setSuccess(() => false);
    let bug = false;
    
    if (passwordRef.current.value.trim() === "") {
      passwordRef.current.focus();
      setPasswordError(() => "Password is required");
      bug = true;
    } else {
      setPasswordError(() => "");
    }

    if (nameRef.current.value.trim() === "") {
      nameRef.current.focus();
      setNameError(() => "Username is required");
      bug = true;
    } else {
      setNameError(() => "");
    }

    if (emailRef.current.value.trim() === "") {
      emailRef.current.focus();
      setEmailError(() => "Email is required");
      bug = true;
    } else {
      setEmailError(() => "");
    }

    if (lastNameRef.current.value.trim() === "") {
      lastNameRef.current.focus();
      setLastNameError(() => "Last name is required");
      bug = true;
    } else {
      setLastNameError(() => "");
    }

    if (firstNameRef.current.value.trim() === "") {
      firstNameRef.current.focus();
      setFirstNameError(() => "First name is required");
      bug = true;
    } else {
      setFirstNameError(() => "");
    }

    if (bug) { // Check for any error
      setStatus(() => "normal");
      return;
    }

    const data = {
      username: nameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      first_name: firstNameRef.current.value.trim(),
      last_name: lastNameRef.current.value.trim(),
      password: passwordRef.current.value.trim(),
    }

    try {
      // Send request and await response
      const response = await postData(data, PATHS.register);

      if (response.status === 201) { // Successfully created
        setMessage("Account created successfully!");
        setSuccess(() => true);

        setStatus(() => "normal");
        nameRef.current.value = "";
        firstNameRef.current.value = "";
        lastNameRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch(error) {
        const errors = error?.response?.data;
        if (errors?.email) {
            setEmailError(errors?.email[0]);
        }
        if (errors?.username) {
            setNameError(errors?.username[0]);
        }

        if (errors?.first_name) {
            setFirstNameError(errors?.first_name[0]);
        }

        if (errors?.last_name) {
            setLastNameError(errors?.last_name[0]);
        }
        setError(() => `Account creation failed try again!`)  
    }

    setStatus(() => "normal");
  }
  return (
    <>
      {
        oauthSuccess ? (
          <LoginSpinner />
        ) : (
          <>
            <section id="formWrapper" className="w-full bg-primary">
              <div className="container mx-auto py-10 flex flex-col lg:flex-row">
                <article className="w-full flex justify-center items-center py-10">
                  <div className="bg-primaryBackground rounded-xl p-6 max-w-xl w-full space-y-2 flex flex-col 
                      items-center drop-shadow-lg sm:p-10 sm:py-12 md:mx-0">

                      <div className="flex flex-col justify-center w-full">
                        <h1 className="font-serif text-[40px] text-center font-bold text-black mb-4">
                          Register
                        </h1>

                        <div className="flex flex-col items-start gap-y-8">
                          <div className="w-full pb-6 ">
                            <p className="text-lg text-black mb-4 text-center">
                              Using social networking accounts
                            </p>

                            <div className="flex flex-col items-center gap-4">
                              <button onClick={() => {
                                setStatus(() => "loading");
                                login();
                              }} className="group text-black text-base py-3 px-5 rounded-md bg-white
                                  flex items-center shadow-md gap-6 w-max">
                                <img src={googleLogo} className="h-6 w-6 transition-transform" alt="Google logo" />
                                <span className="">Register with Google</span>
                              </button>
                            </div>
                          </div>

                          <article className="w-full flex flex-col items-center px-4 md:px-0">
                            <form onSubmit={handleSubmit} id="contact-form" method="post" className="w-full space-y-4 sm:space-y-4">
                              {
                                /** Error message */
                                error && (
                                  <Message type="error" message={error} status={true} />
                                )
                              }

                              <div className="flex flex-col space-y-2">
                                <Label htmlFor="username" text="Username" />
                                <div>
                                  <Input type="text" disabled={status === "loading"} placeholder="Username" name="username" id="username" reff={nameRef} handleChange={() => handleBlankInput(nameRef, setNameError, "Name is required")} error={nameError !== ""} />
                                  <Error active={nameError} text={nameError} />
                                </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                <Label htmlFor="firstname" text="First name" />
                                <div>
                                  <Input type="text" disabled={status === "loading"} placeholder="First name" name="firstname" id="firstname" reff={firstNameRef} handleChange={() => handleBlankInput(firstNameRef, setFirstNameError, "First name is required")} error={firstNameError !== ""} />
                                  <Error active={firstNameError} text={firstNameError} />
                                </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                <Label htmlFor="lastname" text="Last name" />
                                <div>
                                  <Input type="text" disabled={status === "loading"} placeholder="Last name" name="lastname" id="lastname" reff={lastNameRef} handleChange={() => handleBlankInput(lastNameRef, setLastNameError, "Last name is required")} error={lastNameError !== ""} />
                                  <Error active={lastNameError} text={lastNameError} />
                                </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                <Label htmlFor="email" text="Email" />
                                <div>
                                  <Input type="text" disabled={status === "loading"} placeholder="Email" name="email" id="email" reff={emailRef} handleChange={handleEmail} error={emailError !== ""} />
                                  <Error active={emailError} text={emailError} />
                                </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                  <Label htmlFor="password" text="Password" />
                                <div>
                                  <Input type="password" disabled={status === "loading"} placeholder="Password" name="password" id="password" reff={passwordRef} handleChange={() => handleBlankInput(passwordRef, setPasswordError, "Password is required")} error={passwordError !== ""} />
                                  <Error active={passwordError} text={passwordError} />
                                </div>
                              </div>
                              <div className="flex justify-center mt-8 sm:mt-10">
                                <button type="submit" disabled={status === "loading"}
                                    className="flex flex-row items-center text-base font-semibold px-5 py-4 bg-primary rounded-md justify-center
                                      text-white gap-x-2 drop-shadow-lg disabled:opacity-50 disabled:cursor-not-allowed outline-offset-2 outline-primary outline-1 focus:outline
                                      active:drop-shadow-none hover:bg-primaryLight">
                                  <span className={`text-lg sm:text-xl`}>{status === "loading" ? "Registering...." : "Register"}</span>
                                </button>
                              </div>
                            </form>

                            <Link to="/login" className="text-lg text-black mt-5 group">
                              Already have an account? <span className="text-primary group">Login</span>
                            </Link>
                          </article>
                        </div>
                      </div>

                  </div>
                </article>
              </div>
            </section>

            {
              success && (
                <div className="fixed left-4 bottom-4 flex flex-col space-y-4 z-10">
                  <Message type="success" message={message} status={success} />
                </div>
              )
            }
          </>
        )
      }
    
    </>
  )
}

export default Register;