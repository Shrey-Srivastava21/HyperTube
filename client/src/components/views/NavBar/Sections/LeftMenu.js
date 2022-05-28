import React from 'react';
import { Menu } from 'antd';
import { useSelector } from "react-redux";
import { createFromIconfontCN } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const PopcornIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1804216_05evm2uwptc9.js',
});

function LeftMenu(props) {
  const { t } = useTranslation();

  const user = useSelector(state => state.user)

  if (user.userData && !user.userData.isAuth) {
  return ""
    } else {
    return (
      <Menu mode={props.mode}>
      <Menu.Item key="">
      <a href="/favorite"><PopcornIcon type="icon-popcorn" style={{fontSize: "25px"}}/>{t('navbar.favorites')}</a>
      </Menu.Item>
    </Menu>
    )
  }
}

export default LeftMenu