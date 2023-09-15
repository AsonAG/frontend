import { CircularProgress, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth, hasAuthParams } from "react-oidc-context";

function Centered({children}) {
    return  <Stack justifyContent="center" alignItems="center" sx={{height: "100%"}}>
                {children}
            </Stack>;
}

function SignIn({children}) {
    const auth = useAuth();
    const [hasTriedSignin, setHasTriedSignin] = useState(false);

    // automatically sign-in
    useEffect(() => {
        if (!hasAuthParams() &&
            !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading &&
            !hasTriedSignin
        ) {
            const state = { location: window.location.pathname };
            auth.signinRedirect({ state });
            setHasTriedSignin(true);
        }
    }, [auth, hasTriedSignin]);

    if (auth.isLoading) {
        return <Centered><CircularProgress /></Centered>
    }

    if (auth.error) {
        return <Centered>Oops... {auth.error.message}</Centered>;
    }


    if (!auth.isAuthenticated) {
        return <Centered>Unable to log in</Centered>;
    }

    return children;
}

export default SignIn;