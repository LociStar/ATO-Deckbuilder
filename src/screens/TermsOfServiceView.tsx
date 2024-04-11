import {Link, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function TermsOfService() {
    return (
        <Card sx={{marginX: 20, marginTop: 2}}>
            <CardContent>
                <Stack alignItems='center' spacing={4}>
                    <Typography variant="h4" gutterBottom>Terms of Service</Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        Last updated: October 04, 2024
                    </Typography>
                    <Typography variant="h5" gutterBottom>Usage Agreement</Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        By creating an account for this website are you agreeing to the
                        below
                        mentioned Terms and Privacy Policy (Policy) of the bot.
                        <br></br>
                        You acknowledge that you have the privilege to use the the website and its services freely, but
                        this privilege might get revoked for you, if you're subject of breaking the terms and/or policy
                        of this
                        website, or the <Link color="secondary" href="https://legal.paradoxplaza.com/eula?locale=en">User Agreement</Link>, <Link color="secondary"
                        href="https://legal.paradoxplaza.com/privacy?locale=en">Privacy Policy</Link> and/or <Link color="secondary"
                        href="https://forum.paradoxplaza.com/forum/help/terms/">Community Code of Conduct</Link> of <Link color="secondary" href="https://www.paradoxinteractive.com/games/across-the-obelisk/about">Paradox Interactive</Link>
                        <br></br>
                        Through using the website it may collect specific data as described in its Policy. The intended
                        usage of
                        this data is for core functionalities of the website.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Intended Age
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        The bot may not be used by individuals under the minimal age described in Paradox Interactive Terms of
                        Service.
                        Using the website under the described age will be seen as a violation of these terms
                        and will
                        result in a removal of your account from this website.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Affiliation
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        The website is not affiliated with, supported or made by Paradox Interactive and the Developers of Across the Obelisk. Any direct connection to
                        Paradox Interactive or any of
                        its Trademark objects is purely coincidental. We do not claim to have the copyright ownership of
                        any of
                        Paradox Interactive assets, trademarks or other intellectual property.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Liability
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        The owner of the website may not be made liable for individuals breaking these Terms at any given
                        time. He has
                        faith in the end users being truthfull about their information and not misusing this bot or The
                        Services of
                        Paradox Interactive in a malicious way.
                        <br></br>
                        We reserve the right to update these terms at our own discretion, giving you a 1-Week (7 days)
                        period to opt
                        out of these terms if you're not agreeing with the new changes. You may opt out by deleting your account from this website.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Contact
                    </Typography>
                    <Typography variant="body1" align='center' gutterBottom>
                        People may get in contact through GitHub at <Link color="secondary" href="https://github.com/LociStar/ATO-Deckbuilder">ATO-Deckbuilder</Link>. Other ways of support
                        may be
                        provided but aren't guaranteed.
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}