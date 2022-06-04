import React, { Component } from "react";
import api from "../../services/api";
import { BsList, BsPen } from "react-icons/bs";
import { NavLink, useNavigate, useLocation, useParams } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

import "./SideBar.scss";

import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    list: [],
    menuCollapsed: false,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("listId").name,
  });

  loadAllLists = async () => {
    const response = await api.get("/list");
    this.setState({
      list: response.data,
    });

    this.props.router.params.listas = response.data;
  };

  async componentDidMount() {
    this.loadAllLists();
  }

  async componentDidUpdate(prevOps) {


    //CONFIG PARA ALTERAR NOME TAMBEM NO SIDEBAR
    if (prevOps.router.params.listas !== undefined) {
      if (prevOps.router.params.listas !== this.state.list) {
        let listasAtualizadas = this.props.router.params.listas;
        this.setState({
          list: listasAtualizadas,
        });
      }
    }
  }

  logoOnClick = (e) => {
    e.preventDefault();
    let { menuCollapsed } = this.state;

    if (menuCollapsed) {
      this.setState({
        menuCollapsed: false,
      });
    } else {
      this.setState({
        menuCollapsed: true,
      });
    }
  };

  render() {
    const { list, menuCollapsed } = this.state;

    let navigate = this.props.router.navigate;

    let active = parseInt(window.location.pathname.replace("/list/", ""));

    const newList = async (evt) => {
      evt.preventDefault();
      let list = {
        id: "",
        name: "novo",
        tasks: [
          {
            id: "",
            name: "",
            description: "",
            favorite: false,
            reminder: null,
          },
        ],
      };

      const response = await api.post("/list", list);

      this.setState({
        list: [...this.state.list, response.data],
      });

      navigate("/list/" + response.data.id);
    };

    return (
      <ProSidebar collapsed={menuCollapsed}>
        <SidebarHeader>
          <MenuItem id="logo" onClick={(e) => this.logoOnClick(e)}>
            {menuCollapsed ? "" : <h1>Noted</h1>}{" "}
            <BsPen
              className={menuCollapsed ? "icon__pen-closed" : "icon__pen"}
            />
          </MenuItem>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="round">
            {list?.map((index) => (
              <MenuItem
                key={index.id}
                icon={<BsList />}
                active={index.id === active}
                // suffix={<GrTrash/>}
              >
                <NavLink  to={`/list/${encodeURIComponent(index.id)}`}>
                  {index.name}
                </NavLink>
              </MenuItem>
            ))}
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <Menu iconShape="round">
            <MenuItem id="last-item" icon={<IoMdAdd />}>
              <a href="/" onClick={(e) => newList(e)}>
                new list
              </a>
            </MenuItem>
          </Menu>
        </SidebarFooter>
      </ProSidebar>
    );
  }
}

export default withRouter(SideBar);
