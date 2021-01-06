import { Link as RouterLink } from 'react-router-dom';
import BugIcon from '../svg/bug-logo.svg';

import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Button,
  useMediaQuery,
  Container,
} from '@material-ui/core';
import { useNavStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';

const NavBar = () => {
  const classes = useNavStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  //const history = useHistory();

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar variant="dense" disableGutters={isMobile}>
        <div className={classes.leftPortion}>
          <div className={classes.logoWrapper}>
            <Button
              className={classes.logoBtn}
              component={RouterLink}
              to="/"
              color="secondary"
            >
              <img
                src={BugIcon}
                alt="bugtracker-logo"
                className={classes.svgImage}
              />
              BugTracker
            </Button>
            {!isMobile && (
              <Typography variant="caption" color="secondary">
                Made with{' '}
                <FavoriteIcon style={{ fontSize: 10, color: '#f4649f' }} /> by{' '}
                <Link
                  href={'https://github.com/amand33p'}
                  color="inherit"
                  target="_blank"
                  rel="noopener"
                >
                  <strong>amand33p</strong>
                </Link>
              </Typography>
            )}
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
