import React from 'react';
import './i18n';
import './App.css';
import { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
import { useTranslation } from 'react-i18next';
import Spinner from './views/LandingPage/Sections/Spinner';
import ReactNotification from "react-notifications-component";
import 'react-notifications-component/dist/theme.css'
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import GenresPage from './views/GenresPage/GenresPage.js';
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import MovieDetail from "./views/MovieDetail/MovieDetail";
import FavoritePage from "./views/FavoritePage/FavoritePage";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import Confirmation from "./views/Confirmation/Confirmation";
import ResPassword from "./views/ResetPassword/ResetPassword";
import Reset from "./views/ResetPassword/Reset.js";
import UsersPage from "./views/UsersPage/UsersPage";
import NotFound from "./NotFound";

function App() {
  const { t } = useTranslation();
  return ( 
  
    <Suspense fallback={t(<Spinner />)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
      <div className={"notifications"}> <ReactNotification /> </div>
        <Switch>
          <Route exact path="/" component={Auth(LoginPage, false)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/landing" component={Auth(LandingPage, true)} />
          <Route exact path='/landing/genre/:genreName/:genreId' component={Auth(GenresPage, true)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/movie/:movieId" component={Auth(MovieDetail, true)} />
          <Route exact path="/favorite" component={Auth(FavoritePage, true)} />
          <Route exact path="/profile" component={Auth(ProfilePage, true)} />
          <Route exact path="/users" component={Auth(UsersPage, true)} />
          <Route exact path="/forgot" component={Auth(ResPassword, false)} />
          <Route exact path="/confirmation/:tokenConf" component={Auth(Confirmation, false)} />
          <Route exact path="/confirmation/ResetPassword/Reset/:tokenConf" component={Auth(Reset, false)}/>
          <Route component={Auth(NotFound, null)}/>
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;