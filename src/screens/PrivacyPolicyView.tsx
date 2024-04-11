import CardContent from "@mui/material/CardContent";
import {Link, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

export default function PrivacyPolicy() {
    return (
        <Card sx={{marginX: 20, marginTop: 2}}>
            <CardContent>
                <Stack alignItems='center' spacing={4}>
                    <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        Last updated: April 04, 2024
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        Your privacy is important to us. It is ATO-Deckbuilder’s policy to respect your privacy regarding any
                        information we may collect from you across our website, https://ato-deckbuilder.com, and other
                        sites we own and operate along with any services we offer.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Stored Data
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        We collect your personal information provided by you upon sign in, this includes:
                        <br/>
                        - E-Mail
                        <br/>
                        - Username
                        <br/>
                        Any data submitted to ATO-Deckbuilder will be stored and displayed on the
                        site until deleted by a user or site administrator.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Cookies
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        ATO-Deckbuilder uses cookies to store authentication information. Cookies are also used for functional
                        purposes.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Links to third party Websites
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        We have included links on this site for your use and reference. We are not responsible for the
                        privacy policies on these websites. You should be aware that the privacy policies of these sites
                        may differ from our own.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Caching
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        This site utilizes caching in order to facilitate a faster response time and better user
                        experience. Caching potentially stores a duplicate copy of every web page that is on display on
                        this site. All cache files are temporary and are never accessed by any third party, except as
                        necessary to obtain technical support from the cache plugin vendor. Cache files expire on a
                        schedule set by the site administrator, but may easily be purged by the admin before their
                        natural expiration, if necessary.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Cloudflare
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        We use external scripts from <Link href="https://cloudflare.com/">cloudflare.com</Link>, a
                        service operated by Cloudflare Inc. These scripts are downloaded from Cloudflare’s servers when
                        our web pages are loaded. Your IP address is then transmitted to Cloudflare’s servers.
                        Cloudflare will also store this information where necessary. Further information on the use of
                        transmitted data by Cloudflare can be found in <Link
                        href="https://www.cloudflare.com/privacypolicy/">Cloudflare’s Privacy Policy</Link>.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Changes to this Privacy Statement
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        The contents of this statement may be altered at any time, at our discretion.
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}