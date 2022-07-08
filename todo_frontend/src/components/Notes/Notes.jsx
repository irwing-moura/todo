import React, { Component } from "react";
import { GrTrash } from "react-icons/gr";

import SideBar from "../SideBar/SideBar";

import "./Notes.scss";
import api from "../../services/api";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

class Notes extends Component {
  constructor(props) {
    super(props);
    this.timeout = 0;
  }

  state = {
    list: {},
    tasks: [],
    listaAtualizada: [],
  };

  async componentDidMount() {
    this.setState({
      list: {},
      tasks: [],
    });

    let listId = this.props.router.params.listId;

    if (listId === undefined) {
      const response = await api.get("/list");
      listId = response.data[0].id;
      let navigate = this.props.router.navigate;
      navigate("/list/" + listId);
    } else {
      this.loadListDetails(decodeURIComponent(listId));
    }
  }

  async componentDidUpdate(prevOps) {
    this.props.router.params.listActived = this.state.list;

    if (prevOps.router.params.listId !== this.props.router.params.listId) {
      // ATUALIZANDO ULTIMA LISTA - ACERTAR
      await api
        .put("/list/update-tasks", this.state.list)
        .then(function (response) {
          console.log("atualizou anterior");
        })
        .catch(function (error) {
          alert(error);
        });

      const listId = this.props.router.params.listId;
      this.loadListDetails(decodeURIComponent(listId));
    }
  }

  loadListDetails = async (page) => {
    const response = await api.get(`/list/${page}`);

    //CASO PONHA ID DE LISTA INEXISTENTE NA URL, REDIRECIONAR PARA PRIMEIRA DA LISTA
    if (response.data === "") {
      const response = await api.get("/list");
      this.props.router.navigate("/list/" + response.data[0].id);
    }

    this.setState({
      list: response.data,
      tasks: response.data.tasks,
    });
  };

  async saveTasks(event, index) {
    let input = event.target;
    let { list } = this.state;

    let newTasks = [...list.tasks];

    newTasks[parseInt(index)] = {
      id: input.id,
      name: input.value,
      description: "",
      favorite: false,
      reminder: null,
    };

    this.setState({
      list: {
        id: this.state.list.id,
        name: this.state.list.name,
        tasks: newTasks,
      },
    });

    await api
      .put("/list/update-tasks", this.state.list)
      .then(function (response) {})
      .catch(function (error) {})
      .finally(function () {
        //toast.success("saved");
      });

    this.props.nameChanged = input.value;
  }

  async onChangeTask(e, idx) {
    let items = [...this.state.list.tasks];
    let item = { ...items[idx] };
    item.name = e.target.value;
    items[idx] = item;

    this.setState({
      list: {
        id: this.state.list.id,
        name: this.state.list.name,
        tasks: items,
      },
    });

    await api
      .put("/task/", item)
      .then(function (response) {})
      .catch(function (error) {});

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      toast.success("saved");
    }, 2000);
  }

  async saveTitle(event, list) {
    let title = event.target.value;
    let newList = list;
    newList.name = title;

    //let items = [...this.state.list.tasks];

    this.setState({
      list: newList,
    });

    await api
      .put("/list/", newList)
      .then(function (response) {})
      .catch(function (error) {});

    //CONFIG PARA ALTERAR NOME TAMBÉM NO SIDEBAR
    let propsListas = this.props.router.params.listas;
    debugger;
    if (propsListas !== undefined) {
      propsListas.map((index, i) => {
        if (index.id === this.props.router.params.listActived.id) {
          propsListas[i] = this.props.router.params.listActived;
          this.props.router.params.listas = propsListas;
          this.setState({
            listaAtualizada: this.props.router.params.listas,
          });
        }
      });
    } else {
      propsListas = this.state.listaAtualizada;

      if (propsListas.length === 0) {
        const { data } = await api.get("/list");
        propsListas = data;
      }

      propsListas.map((index, i) => {
        if (index.id === this.props.router.params.listActived.id) {
          propsListas[i] = this.props.router.params.listActived;
          this.props.router.params.listas = propsListas;
          this.setState({
            listaAtualizada: this.props.router.params.listas,
          });
        }
      });
    }

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      toast.success("saved");
    }, 2000);
  }

  newLi(event, index) {
    if (event.key === "Enter") {
      this.saveTasks(event, index);

      const newTask = [
        ...this.state.list.tasks,
        {
          name: "",
          description: "",
          favorite: false,
          reminder: null,
        },
      ];

      this.setState(
        {
          tasks: newTask,
        },
        () => {
          this.setState({
            list: {
              id: this.state.list.id,
              name: this.state.list.name,
              tasks: this.state.tasks,
            },
          });
        }
      );
    }
  }

  async removeLi(task) {
    let tasks = this.state.list.tasks;

    //TODO:: ACERTAR ESSE IF, ELE É USADO PARA APAGAR O ULTIMO ITEM DA LISTA, AGORA DA ERRO NO COMPONENTUPDATE
    if (tasks.length === 1) {
      let items = [...this.state.list.tasks];
      let item = { ...tasks[0] };
      item.name = "";
      items[0] = item;
      this.setState({
        list: {
          id: this.state.list.id,
          name: this.state.list.name,
          tasks: items,
        },
      });

      await api
        .put("/task/", item)
        .then(function (response) {})
        .catch(function (error) {});
    } else {
      let updatedTasks = tasks.filter(function (index) {
        return index !== task;
      });

      this.setState({
        list: {
          id: this.state.list.id,
          name: this.state.list.name,
          tasks: updatedTasks,
        },
      });

      await api
        .delete(`/task/${task.id}`)
        .then(function (response) {})
        .catch(function (error) {});

      toast.error("task removed");
    }
  }

  async deleteList(list) {
    //VAI PARA A PRIMEIRA LISTA
    const response = await api.get("/list");
    let listId = response.data[0].id;
    let navigate = this.props.router.navigate;
    navigate("/list/" + listId);

    //DELETA A LISTA
    await api.delete(`/list/${list.id}`);

    toast.error("list deleted");
  }

  render() {
    const { list } = this.state;
    return (
      <>
        <SideBar name={list?.name} _id={list?.id} />

        <div className="container__note">
          <div className="content__note">
            <div className="div__title">
              <input
                className="title"
                type="text"
                maxLength={30}
                id={list?.id}
                value={list?.name}
                onChange={(e) => this.saveTitle(e, list)}
              />
              <GrTrash
                className="icon__trash"
                onClick={() => this.deleteList(list)}
              />
            </div>
            <ul id="list">
              {list.tasks?.map((task, idx) => (
                <li key={idx}>
                  <input className="checkbox" type="checkbox" />

                  <input
                    placeholder="escreva aqui..."
                    id={task?.id}
                    type="text"
                    value={task?.name || ""}
                    onChange={(e) => this.onChangeTask(e, idx)}
                    onKeyDown={(e) => this.newLi(e, idx)}
                    autoFocus
                  />
                  <GrTrash
                    className="icon__trash"
                    onClick={() => this.removeLi(task)}
                  />
                </li>
              ))}
            </ul>
            {/* <button
            onClick={() => this.newLi(this)}
            type="button"
            className="btn__create-task"
          >
            <GrFormAdd className="icon__add"/> add task
          </button> */}
            <ToastContainer
              autoClose={1500}
              hideProgressBar={true}
              closeOnClick
            />
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Notes);
