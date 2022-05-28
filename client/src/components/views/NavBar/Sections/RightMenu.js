/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { LogoutOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { createFromIconfontCN } from '@ant-design/icons';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginLeft: 10, 
    alignItems: 'center',
  },
  selectEmpty: {
    '& .MuiSelect-root': {
      background: 'white',
  },
    marginTop: theme.spacing(2),
    marginLeft: 10,
  },
}));

function RightMenu(props) {

  const { t, i18n } = useTranslation();
  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };
  let language = i18n.language;

  const classes = useStyles();
  function onChange(e) {
    changeLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  }

  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  const [Username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchUsername()
    if (!mounted){
      setMounted(true);
  }
    }, [props, mounted])

  const fetchUsername = () => {
    axios.get('/api/users/auth')
      .then(response => {
        if (response.data) {
          setUsername(response.data.username)
        } else {
          alert('Failed to get Username')
        }
      })
  }

  const GroupIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1804216_5e8qc34kmnl.js',
  });

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">{t('navbar.login')}<LoginOutlined style={{padding: "10px"}}/></a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">{t('navbar.register')}<UserAddOutlined style={{padding: "10px"}}/></a>
        </Menu.Item>
        <React.Fragment>
        <FormControl className={classes.formControl}>
          <Select
            value={language}
            onChange={onChange}
            displayEmpty
            autoWidth
            disableUnderline
            IconComponent={() => ""}
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="en-US"><img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_25/v1585483470/united-states-of-america-flag-button-round-xs_xgcefz.png" alt="US Flag"/></MenuItem>
            <MenuItem value="fr-FR"><img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_25/v1585483466/france-flag-button-round-icon-64_uqllrc.png" alt="French Flag" /></MenuItem>
          </Select>
        </FormControl>
        </React.Fragment>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="profile"><a href="/profile">{t("navbar.welcome")}&nbsp;&nbsp;<span className="username">{Username}</span></a>
        </Menu.Item>
        <Menu.Item key="users">
          <a href="/users"><GroupIcon type="icon-group" style={{fontSize: "20px"}}/>{t('navbar.users')}</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}><LogoutOutlined />{t('navbar.logout')}</a>
        </Menu.Item>
        <React.Fragment>
        <FormControl className={classes.formControl}>
          <Select
            value={language}
            onChange={onChange}
            displayEmpty
            autoWidth
            disableUnderline
            IconComponent={() => ""}
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="en-US"><img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_25/v1585483470/united-states-of-america-flag-button-round-xs_xgcefz.png" alt="US Flag" /></MenuItem>
            <MenuItem value="fr-FR"><img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_25/v1585483466/france-flag-button-round-icon-64_uqllrc.png" alt="French Flag" /></MenuItem>
          </Select>
        </FormControl>
        </React.Fragment>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);