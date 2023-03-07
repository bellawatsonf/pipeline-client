import { Button, Nav, NavItem } from "reactstrap";
import Logo from "../../logo/Logo";
import Link from "next/link";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ModalChangePassword from "../../../components/modal-change-password";
import React from "react";

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: "bi bi-speedometer2",
    level: ["admin", "user", "super admin"],
  },
  {
    title: "Sector",
    href: "/sector",
    icon: "bi bi-card-text",
    level: ["admin", "super admin"],
  },
  {
    title: "Progress",
    href: "/progress",
    icon: "bi bi-textarea-resize",
    level: ["admin", "super admin"],
  },
  {
    title: "Submission Status",
    href: "/submission-status",
    icon: "bi bi-patch-check",
    level: ["admin", "super admin"],
  },
  {
    title: "Group",
    href: "/group-user",
    icon: "bi bi-hdd-stack",
    level: ["admin", "super admin"],
  },
  {
    title: "User",
    href: "/user",
    icon: "bi bi-people",
    level: ["admin", "super admin"],
  },
  {
    title: "Pipeline",
    href: "/pipeline",
    icon: "bi bi-link",
    level: ["admin", "user", "super admin"],
  },
  // {
  //   title: "Alert",
  //   href: "/ui/alerts",
  //   icon: "bi bi-bell",
  // },
  // {
  //   title: "Badges",
  //   href: "/ui/badges",
  //   icon: "bi bi-patch-check",
  // },
  // {
  //   title: "Buttons",
  //   href: "/ui/buttons",
  //   icon: "bi bi-hdd-stack",
  // },
  // {
  //   title: "Cards",
  //   href: "/ui/cards",
  //   icon: "bi bi-card-text",
  // },
  // {
  //   title: "Grid",
  //   href: "/ui/grid",
  //   icon: "bi bi-columns",
  // },
  // {
  //   title: "Table",
  //   href: "/ui/tables",
  //   icon: "bi bi-layout-split",
  // },
  // {
  //   title: "Forms",
  //   href: "/ui/forms",
  //   icon: "bi bi-textarea-resize",
  // },
  // {
  //   title: "Breadcrumbs",
  //   href: "/ui/breadcrumbs",
  //   icon: "bi bi-link",
  // },
  // {
  //   title: "About",
  //   href: "/about",
  //   icon: "bi bi-people",
  // },
];

const Sidebar = ({ showMobilemenu }) => {
  let levelUser = "";
  if (typeof window !== "undefined") {
    // Perform localStorage action
    levelUser = localStorage.getItem("level");
  }
  let curl = useRouter();
  const location = curl.pathname;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (params, x) => {
    // setStatusForm(params);
    setOpen(true);
    // setId(x);
  };

  const handleClose = (params, x) => {
    setOpen(false);
  };

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        {/* <Logo /> */}
        <Typography
          sx={{ fontFamily: "Montserrat", fontSize: "24px", fontWeight: 700 }}
        >
          Pipeline Management
        </Typography>
        <Button
          close
          size="sm"
          className="ms-auto d-lg-none"
          onClick={showMobilemenu}
        ></Button>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {levelUser === "admin" || levelUser === "super admin"
            ? navigation.map((navi, index) => (
                <NavItem key={index} className="sidenav-bg">
                  <Link href={navi.href}>
                    <a
                      className={
                        location === navi.href
                          ? "text-primary nav-link py-3"
                          : "nav-link text-secondary py-3"
                      }
                    >
                      <i className={navi.icon}></i>
                      <span className="ms-3 d-inline-block">{navi.title}</span>
                    </a>
                  </Link>
                </NavItem>
              ))
            : navigation.map((navi, index) =>
                navi.level.map((el) => {
                  if (el === "user") {
                    return (
                      <NavItem key={index} className="sidenav-bg">
                        <Link href={navi.href}>
                          <a
                            className={
                              location === navi.href
                                ? "text-primary nav-link py-3"
                                : "nav-link text-secondary py-3"
                            }
                          >
                            <i className={navi.icon}></i>
                            <span className="ms-3 d-inline-block">
                              {navi.title}
                            </span>
                          </a>
                        </Link>
                      </NavItem>
                    );
                  }
                })
              )}
          <Button
            color="secondary"
            tag="a"
            target="_blank"
            className="mt-3"
            onClick={() => handleClickOpen("add", null)}

            // href="https://www.wrappixel.com/templates/xtreme-next-js-free-admin-template/"
          >
            Change Password
          </Button>
          {/* <Button
            color="danger"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://www.wrappixel.com/templates/xtreme-react-redux-admin/?ref=33"
          >
            Upgrade To Pro
          </Button> */}
        </Nav>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            background: "#eef5f9",
            width: "500px",
            height: "100%",
            // paddingBottom: "40px",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              fontFamily: "fangsong",
              paddingBottom: "10px",
            }}
          >
            Change Password Form
          </Typography>
          <ModalChangePassword
            // fetchPipeline={() =>
            //   fetchPipeline({ size: stateField.size, page: stateField.page })
            // }
            setOpen={setOpen}
            // statusForm={statusForm}
            // id={id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
