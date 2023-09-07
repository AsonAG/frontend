import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth, hasAuthParams } from "react-oidc-context";


// TODO AJO test fresh login
function SignIn({children}) {
    const auth = useAuth();
    const [hasTriedSignin, setHasTriedSignin] = useState(false);

    // automatically sign-in
    useEffect(() => {
        if (!hasAuthParams() &&
            !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading &&
            !hasTriedSignin
        ) {
            auth.signinRedirect();
            setHasTriedSignin(true);
        }
    }, [auth, hasTriedSignin]);

    if (auth.isLoading) {
        return <CircularProgress />;
    }

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }


    if (!auth.isAuthenticated) {
        return <div>Unable to log in</div>;
    }

    return children;
}

export default SignIn;