import { useState, useEffect } from "react";
import { useAuth, hasAuthParams } from "react-oidc-context";
import { Centered } from "../components/Centered";
import { Loading } from "../components/Loading";


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
        return <Loading />
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