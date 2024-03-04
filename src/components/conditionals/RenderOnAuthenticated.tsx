import { h } from 'preact';
import { useAuth } from "react-oidc-context";

interface Props {
    children: h.JSX.Element[];
}

const RenderOnAuthenticated = ({children}: Props) => (useAuth().isAuthenticated) ? <>{children}</> : null;

export default RenderOnAuthenticated;