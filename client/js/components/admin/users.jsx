"use strict";

import React            from "react";
import BaseComponent    from "../base_component";
import { Link }         from "react-router";
import Validator        from "validator";
import UserActions      from "../../actions/user";
import _                from "lodash";
import assign           from "object-assign";
import CreateUserForm   from "./create_user_form";
import EditUserForm     from "./edit_user_form";
import AdminActions     from "../../actions/admin";
import ApplicationStore from "../../stores/application";
import AccountsStore    from "../../stores/accounts";
import AdminStore       from "../../stores/admin";
import EditUserForm     from "./edit_user_form";
import AdminStore       from "../../stores/admin";
import Expandable       from "./expandable";
import Defines          from "../defines";
import Container        from "./container";
import { Toolbar, ToolbarGroup, ToolbarTitle, FontIcon, RaisedButton, Paper, IconButton, Checkbox} from "material-ui";

class Users extends BaseComponent {

  constructor(props, context){
    super(props);
    this.state = this.getState(props.params.accountId);
    this.state.currentUser = {name: "", email: "", role: ""};
    this.stores = [AccountsStore, ApplicationStore];
    AdminActions.loadUsers(props.params.accountId);
  }

  getState(accountId){
    return {
      users          : AccountsStore.currentUsers(),
      currentAccount : AccountsStore.accountById(accountId),
      selectedUsers  : AccountsStore.getSelectedUsers()
    };
  }

  onMenuItemClick(e, key, payload){
    if(this.refs[payload.ref].isChecked()){
      this.refs[payload.ref].setChecked(false);
      AdminActions.removeFromSelectedUsers(payload.user);
    } else {
      this.refs[payload.ref].setChecked(true);
      AdminActions.addToSelectedUsers(payload.user);
    }
  }

  editButtonClicked(id){
    this.refs[id+"editForm"].show();
  }

  deleteButtonClicked(user){
    AdminActions.deleteUser(user);
  }

  getStyles(){
    return {
      toolbarStyle: {
        backgroundColor: Defines.colors.lightGrey
      },
      titleStyle:{
        color: Defines.colors.black
      },
      table: {
        width: "100%"
      },
      paper: {
        margin: "auto 20px",
        marginRight: "48px"
      },
      row: {
        height: "60px"
      },
      id: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "8%",
      },
      avatar: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "8%",
      },
      username: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "20%",
      },
      role: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "10%",
      },
      sCount: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "14%",
      },
      lastS: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "16%",
      },
      icons: {
        borderBottom: "1px solid " + Defines.colors.lightGrey, 
        width: "28%",
      },
      span: {
        display: "table-cell",
        verticalAlign: "middle",
      },
      button: {
        marginLeft: "15px"
      }
    }
  }

  toggle(e, id){
    var ref = id + "expandable";
    this.refs[ref].toggle()
  }

  addUser(){
    this.refs.createUserForm.show();
  }

  render() {
    var styles = this.getStyles();
    var headers = (
        <tr style={styles.row}>
          <th style={styles.id}>ID</th>
          <th style={styles.avatar}>Avatar</th>
          <th style={styles.username}>Username</th>
          <th style={styles.role}>Role</th>
          <th style={styles.sCount}>Sign In Count</th>
          <th style={styles.lastS}>Last Sign In</th>
          <th style={styles.icons}></th>
        </tr>
      )
    var users = this.state.users.map((user, index)=>{
      return (
        <tbody key={user.id +"" + index}>
        <tr style={styles.row}>
          <td style={styles.id}>{user.id}</td>
          <td style={styles.avatar}>{user.name}</td>
          <td style={styles.username}>{user.email}</td>
          <td style={styles.role}>{user.role}</td>
          <td style={styles.sCount}>SIGN IN COUNT</td>
          <td style={styles.lastS}>LAST SIGN IN</td>
          <td style={styles.icons}>
            <span style={styles.span}> 
              <div >
                <RaisedButton  label="SHOW DETAILS" onClick={(e)=>{this.toggle(e, user.id)}} />
              </div>
            </span>
            <span style={styles.span}>
              <div style={styles.button}>
                <IconButton iconStyle={styles.iconStyle} iconClassName="material-icons-action-create" onTouchTap={()=>{this.editButtonClicked(user.id)}}/>
              </div>
            </span>
            <span style={styles.span}>
              <div style={styles.button}>
                <IconButton iconStyle={styles.iconStyle} iconClassName="material-icons-action-delete" onTouchTap={()=>{this.deleteButtonClicked(user)}} />
              </div>
            </span>
            <span style={styles.span}>
              <div style={styles.button}>
                <Checkbox />
              </div>
            </span>
          </td>
        </tr>
        <EditUserForm user={user} ref={user.id + "editForm"} />        
        <Expandable ref={user.id + "expandable"}/>
        </tbody>
        )
    })
    return (
      <div>
        <Container>
          <Toolbar style={styles.toolbarStyle}>
            <ToolbarGroup key={0} float="left">
              <ToolbarTitle style={styles.titleStyle} text="Users" />
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">
              <FontIcon className="material-icons-action-search" />
              <RaisedButton label="Create New User" onClick={()=>{this.addUser()}} primary={true} />
            </ToolbarGroup>
          </Toolbar>
          <Paper style={styles.paper}>
            <table style={styles.table}>
              {headers}
              {users}
            </table>
          </Paper>
        </Container>
        <CreateUserForm ref="createUserForm" accountId={this.props.params.accountId} />
      </div>
    );
  }

}

Users.propTypes = {
  params: React.PropTypes.object.isRequired
};

module.exports = Users;