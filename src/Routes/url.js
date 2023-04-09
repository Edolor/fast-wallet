/** BASE URL FOR BACKEND API */
const baseURL = "http://wallet-env.eba-gr5bgv3s.eu-north-1.elasticbeanstalk.com";

const PATHS = {
    register: "/account/register/",
    login: "/account/login/",
    details: "/account/details/",
    changePassword: "/account/change-password/",

    fetchWallet: "/wallet/",
    fundWallet: "/wallet/fund/",
    transferFund: "/wallet/transfer/",
    googleOAUTH: "/oauth/google-auth/",
    fetchTransactions: "/wallet/transactions/",
};

const clientID = "1066944143940-ot94bjkttr1f61kset8650km8t83nt6o.apps.googleusercontent.com";

export { baseURL, PATHS, clientID };