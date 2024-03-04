import { h } from 'preact';
import { useAuth } from "react-oidc-context";

interface Props {
    children: h.JSX.Element[] | h.JSX.Element;
}

const RenderOnAnonymous = ({children}: Props) => (!useAuth().isAuthenticated) ? <>{children}</> : null;

export default RenderOnAnonymous;