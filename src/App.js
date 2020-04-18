import React, { useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  withRouter,
  Redirect
} from "react-router-dom";
import { useLocation } from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./styles.css";

const Home = () => <div className="home">Home Component</div>;
const Topics = () => <div className="topics">Topics Component</div>;
const About = ({ children }) => (
  <>
    <div className="about">
      <div>About Component</div>
      {children}
    </div>
  </>
);

const AboutInner1 = () => (
  <div className="about-inner-1">About Inner Component 1</div>
);
const AboutInner2 = () => (
  <div className="about-inner-2">About Inner Component 2</div>
);

const getLevelName = (pathname, level) =>
  pathname === "/" && level === 0
    ? "/"
    : pathname.split("/").filter(Boolean)[level];

const WatchLastVisited = ({ children, location }) => {
  useEffect(() => () => console.log(location.pathname), [location]);
  return <>{children}</>;
};

const AnimatedSwitch = withRouter(({ location }) => {
  return (
    <TransitionGroup component={null}>
      <CSSTransition
        // getLevelName makes animation work only when
        // appropriate level in location.pathname changes
        key={getLevelName(location.pathname, 0)}
        classNames="slide"
        timeout={1000}
      >
        <Switch location={location}>
          <Route path="/" component={Home} exact />
          <Route path="/topics" component={Topics} />

          <Route
            path="/about"
            render={props => {
              const defaultPage = "about-inner-1";
              return (
                <About>
                  <TransitionGroup component={null}>
                    <CSSTransition
                      key={
                        getLevelName(props.location.pathname, 1) || defaultPage
                      }
                      classNames="fade"
                      timeout={1000}
                    >
                      <WatchLastVisited location={props.location}>
                        <div className="fade">
                          <Switch location={props.location}>
                            <Redirect
                              exact
                              from={props.match.path}
                              to={`${props.match.path}/${defaultPage}`}
                            />
                            <Route
                              path={`${props.match.path}/about-inner-1`}
                              component={AboutInner1}
                            />
                            <Route
                              path={`${props.match.path}/about-inner-2`}
                              component={AboutInner2}
                            />
                          </Switch>
                        </div>
                      </WatchLastVisited>
                    </CSSTransition>
                  </TransitionGroup>
                </About>
              );
            }}
          />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
});

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AnimatedSwitch />
        <nav>
          <ul>
            <li>
              <Link to="/">Go to home</Link>
            </li>
            <li>
              <Link to="/topics">Go to topics</Link>
            </li>
            <li>
              <Link to="/about">Go to about (redirects to about inner 1)</Link>
            </li>
            <li>
              <Link to="/about/about-inner-1">Go to about inner 1</Link>
            </li>
            <li>
              <Link to="/about/about-inner-2">Go to second inner 2</Link>
            </li>
          </ul>
        </nav>
      </BrowserRouter>
    </div>
  );
}
