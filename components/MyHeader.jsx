import { Login, Widgets } from "@mui/icons-material";
import {
  AppBar,
  Container,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

import { Link } from "../components";

const pages = [
  {
    name: "Home",
    address: "/",
  },
  {
    name: "Client",
    address: "/client",
  },
  {
    name: "Server",
    address: "/server",
  },
  {
    name: "Protected",
    address: "/protected",
  },
  {
    name: "API",
    address: "/api-example",
  },
  {
    name: "Middleware-Protected",
    address: "/middleware-protected",
  },
];

const MyHeader = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  if (!session && loading) return <CircularProgress />;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <Widgets />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            LOGO
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page, index) => (
              <Link
                key={index}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, mx: 1, color: "white", display: "block" }}
                href={page.address}
              >
                {page.name}
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {session ? (
              <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
                color="inherit"
              >
                Logout
                <Login />
              </Button>
            ) : (
              <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
                color="inherit"
              >
                Login
                <Login />
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MyHeader;
