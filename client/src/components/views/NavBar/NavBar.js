import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import { useSelector } from 'react-redux';
import { Drawer, Button } from 'antd';
import { AlignRightOutlined } from '@ant-design/icons';
import './Sections/Navbar.css';

function NavBar() {
  const [visible, setVisible] = useState(false)
  const user = useSelector(state => state.user)

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <nav className="menu" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div className="menu__logo">
      {user.userData && !user.userData.isAuth ?
        <a href="/"><img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_200/v1584983552/logo_lqnlwk.png" alt="Logo" style={{ width: '100%', marginTop: '-5px' }} /></a> 
        : <a href="/landing"><img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_200/v1584983552/logo_lqnlwk.png" alt="Logo" style={{ width: '100%', marginTop: '-5px' }} /></a>
        }
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_right">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <AlignRightOutlined />
        </Button>
        <Drawer
          title="Menu"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  )
}

export default NavBar