import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Context/AuthContext/AuthContext";
import { PATHS } from "../../Routes/url";
import Popup from "../../Components/Popup/Popup";
import Input from "./../../Components/Input/Input";
import Select from "./../../Components/Input/Select";
import Error from "./../../Components/Input/Error";
import Label from "./../../Components/Input/Label";
import Message from '../../Components/Message/Message';


function Dashboard() {
  const { token, getWithToken, postWithToken, patchWithToken } = useAuth();
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(true);
  const amountRef = useRef();
  const walletIDRef = useRef();
  const [transactions, setTransactions] = useState(null);
  const [amountError, setAmountError] = useState("");
  const [walletIDError, setWalletIDError] = useState("");
  const [status, setStatus] = useState("normal");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showTransferPopup, setShowTransferPopup] = useState(false);
  const [error, setError] = useState("");
  const getWithRef = useRef(getWithToken);
  const tokenRef = useRef(token);
  
  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      try {
        // Get wallet details
        const response = await getWithRef.current(PATHS.fetchWallet, tokenRef.current);
        const trans = await getWithRef.current(PATHS.fetchTransactions, tokenRef.current);
        if (!ignore) {
          /// Ignore on clean up
          setWallet(() => response.data);
          setTransactions(() => trans.data);
        }
        
      } catch(error) {
      }

      setLoading(false);
    }

    getData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAmount = (e) => {
    /**
     * Handling amount validity
     */
     const amount =  /^[0-9]+(\.[0-9]+)?$/;
    
    if (amountRef.current.value.trim() === "") {
      setAmountError(() => "Amount is required");
    } else if (amount.test(amountRef.current.value) === false) {
      setAmountError(() => "Only numbers are allowed");
    } else if (parseFloat(amountRef.current.value) < 0) {
      setAmountError(() => "Amount must be above 0");
    } else {
      setAmountError(() => "");
    }
  }

  const handleWalletID = (e) => {
    /**
     * Handling amount validity
     */
     const walledID =  /^[0-9]+(\.[0-9]+)?$/;
    
    if (walletIDRef.current.value.trim() === "") {
      setWalletIDError(() => "Wallet ID is required");
    } else if (walledID.test(walletIDRef.current.value) === false) {
      setWalletIDError(() => "Only numbers are allowed");
    } else if (parseFloat(walletIDRef.current.value) != 15) {
      setWalletIDError(() => "Must be 15 digits");
    } else {
      setWalletIDError(() => "");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus(() => "loading");
    setSuccess(() => false);
    let bug = false;
    
    if (amountRef.current.value.trim() === "") {
      amountRef.current.focus();
      setAmountError(() => "Amount is required");
      bug = true;
    } else {
      setAmountError(() => "");
    }

    if (bug) { // Check for any error
      setStatus(() => "normal");
      return;
    }

    const data = {
      amount: amountRef.current.value.trim(),
    }

    try {
      // Send request and await response
      const response = await patchWithToken(data, PATHS.fundWallet, token);

      if (response.status === 200) { // Successfully created
        setMessage("Funds added!");
        setSuccess(() => true);

        setStatus(() => "normal");
        amountRef.current.value = "";

        setShowPopup(() => false);
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
        // Add data to transactions
      }
    } catch(error) {
      const errors = error?.response?.data;
      if (errors?.amount) {
          setAmountError(errors.amount[0]);
      }
      setError(() => `${error?.response?.statusText}!`) 
    }

    setStatus(() => "normal");
  }

  // Handling of transfer
  const handleTransfer = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setStatus(() => "loading");
    setSuccess(() => false);
    let bug = false;
    
    if (amountRef.current.value.trim() === "") {
      amountRef.current.focus();
      setAmountError(() => "Amount is required");
      bug = true;
    } else {
      setAmountError(() => "");
    }

    if (walletIDRef.current.value.trim() === "") {
      walletIDRef.current.focus();
      setWalletIDError(() => "Wallet ID is required");
      bug = true;
    } else {
      setWalletIDError(() => "");
    }
    

    if (bug) { // Check for any error
      setStatus(() => "normal");
      return;
    }

    const data = {
      amount: amountRef.current.value.trim(),
      reciever: walletIDRef.current.value.trim()
    }

    try {
      // Send request and await response
      const response = await postWithToken(data, PATHS.transferFund, token);

      if (response.status === 200) { // Successfully created
        setSuccess(() => true);
        setMessage("Transfer successuful!");

        setStatus(() => "normal");
        amountRef.current.value = "";
        walletIDRef.current.value = "";

        setShowTransferPopup(() => false);
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
        // Add data to transactions
      }
    } catch(error) {
      const errors = error?.response?.data;
      if (errors?.reciever) {
        setAmountError(errors.reciever[0]);
      }
      if (errors?.amount) {
          setAmountError(errors.amount[0]);
      }
      setError(() => `${error?.response?.statusText}!`) 
    }

    setStatus(() => "normal");
  }


  const spinner = (
    <div className="flex h-20 items-center justify-center">
        <div role="status">
            <svg aria-hidden="true" className="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    </div>
  );

  return (
    <>
      <section id="formWrapper" className="w-full">

        {(!loading && Object.keys(wallet)?.length > 0) && (
          <div className="flex justify-center mt-8">
            <div className="font-serif text-2xl rounded-md text-center pt-8 font-bold text-black mb-2 bg-primaryBackground p-5 shadow-md">
              <p className="mb-5 text-center">Wallet ID: <span className="font-normal">{wallet?.id}</span></p>
              <p className="text-center">Balance: <span className="font-normal">${wallet?.amount.toLocaleString("en-US")}</span></p>
            </div>
          </div>
        )}

        { loading && spinner}

        { (!loading && Object.keys(wallet)?.length === 0) && (
          <p className="text-lg flex items-center justify-center p-6">Could not fetch details, refresh!</p>
        ) }
        
        <div className="container mx-auto pt-8 pb-10 flex flex-col">
          <div className="flex items-center justify-center gap-5">
              <button type="button" onClick={() => setShowTransferPopup(() => true)}
                  className="flex flex-row items-center text-base font-semibold px-7 py-3.5 bg-primary rounded-md
                    text-white drop-shadow-lg
                    active:drop-shadow-none sm:text-lg hover:bg-primaryLight">
                Transfer Funds
              </button>
              <button type="button" onClick={() => setShowPopup(() => true)}
                  className="flex flex-row items-center text-base font-semibold px-7 py-3.5 bg-primary rounded-md
                    text-white drop-shadow-lg
                    active:drop-shadow-none sm:text-lg hover:bg-primaryLight">
                Fund Wallet
              </button>
          </div>
          <table className="border w-full text-lg mt-6 p-4 block">
            <thead>
              <tr className="text-left text-xl">
                <th className="py-2 px-4 w-1/6">S/N</th>
                <th className="py-2 px-4 w-1/6">Name</th>
                <th className="py-2 px-4 w-1/6">Action</th>
                <th className="py-2 px-4 w-1/6">Amount</th>
                <th className="py-2 px-4 w-1/4">Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions?.results.map((transaction, index) => {
                return (<tr key={index}>
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{transaction.name}</td>
                  <td className="py-2 px-4">${transaction.amount.toLocaleString("en-US")}</td>
                  <td className="py-2 px-4">{transaction.action}</td>
                  <td className="py-2 px-4">{transaction.date}</td>
                </tr>)
              })}
            </tbody>
          </table>
          { loading && spinner}
          
        </div>
      </section>
        {/* fund wallet popup */}
        {showPopup && (
          <Popup handleState={setShowPopup}>
            <div className="bg-white max-w-lg w-full shadow-md z-50 p-6 rounded-md">
              <h2 className="font-serif text-3xl text-center font-bold text-black mb-5">
                Fund Wallet
              </h2>

              <form onSubmit={handleSubmit} id="fund-form" method="post" className="w-full space-y-4 sm:space-y-4">
                {
                  /** Error message */
                  error && (
                    <Message type="error" message={error} status={true} />
                  )
                }
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="amount" text="Amount" />
                  <div>
                    <Input type="text" disabled={status === "loading"} placeholder="Amount" name="amount" id="amount" reff={amountRef} handleChange={handleAmount} error={amountError !== ""} />
                    <Error active={amountError} text={amountError} />
                  </div>
                </div>
                
                <div className="flex justify-center mt-8 sm:mt-10">
                  <button type="submit" disabled={status === "loading"}
                      className="flex flex-row items-center text-base font-semibold px-5 py-4 bg-primary rounded-md w-full justify-center
                        text-white gap-x-2 drop-shadow-lg disabled:opacity-50 disabled:cursor-not-allowed outline-1
                        active:drop-shadow-none hover:bg-primaryLight">
                    <span className={`text-lg sm:text-xl`}>{status === "loading" ? "Adding funds..." : "Add funds"}</span>
                  </button>
                </div>
              </form>
            </div>
          </Popup>
        )}

        {/* Transfer popup */}
        {showTransferPopup && (
          <Popup handleState={setShowTransferPopup}>
            <div className="bg-white max-w-lg w-full shadow-md z-50 p-6 rounded-md">
              <h2 className="font-serif text-3xl text-center font-bold text-black mb-5">
                Transfer funds
              </h2>

              <form onSubmit={handleTransfer} id="transfer-form" method="post" className="w-full space-y-4 sm:space-y-4">
                {
                  /** Error message */
                  error && (
                    <Message type="error" message={error} status={true} />
                  )
                }
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="walletID" text="Wallet ID" />
                  <div>
                    <Input type="text" disabled={status === "loading"} placeholder="Wallet ID" name="walletID" id="walletID" reff={walletIDRef} handleChange={handleWalletID} error={walletIDError !== ""} />
                    <Error active={walletIDError} text={walletIDError} />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="amount" text="Amount" />
                  <div>
                    <Input type="text" disabled={status === "loading"} placeholder="Amount" name="amount" id="amount" reff={amountRef} handleChange={handleAmount} error={amountError !== ""} />
                    <Error active={amountError} text={amountError} />
                  </div>
                </div>
                
                <div className="flex justify-center mt-8 sm:mt-10">
                  <button type="submit" disabled={status === "loading"}
                      className="flex flex-row items-center text-base font-semibold px-5 py-4 bg-primary rounded-md w-full justify-center
                        text-white gap-x-2 drop-shadow-lg disabled:opacity-50 disabled:cursor-not-allowed outline-1
                        active:drop-shadow-none hover:bg-primaryLight">
                    <span className={`text-lg sm:text-xl`}>{status === "loading" ? "Transfering funds..." : "Transfer funds"}</span>
                  </button>
                </div>
              </form>
            </div>
          </Popup>
        )}
      {
        success && (
          <div className="fixed left-4 bottom-4 flex flex-col space-y-4 z-10">
            <Message type="success" message={message} status={success} />
          </div>
        )
      }
    </>
  );
}

export default Dashboard;
