import SearchIcon from "@mui/icons-material/Search";
import {alpha, styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));
export default function CustomSearch({setSearchQuery}: { setSearchQuery: (query: string) => void }) {
  return (
      <Search>
          <SearchIconWrapper>
              <SearchIcon/>
          </SearchIconWrapper>
          <StyledInputBase
              placeholder="Search…"
              inputProps={{'aria-label': 'search'}}
              onChange={(event: Event) => setSearchQuery((event.target as HTMLInputElement).value)} // Update the search query state when the user types in the search bar

          />
      </Search>
  );
}