import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ManageNet } from "components/ManageNet";

const App = () => (
  <Router>
    <Menu>
      <Logo>AI Stryktipset!</Logo>
      <Link to="/">Home</Link>
      <Link to="/dummy">Dummy</Link>
    </Menu>

    <Switch>
      <Route path="/dummy">
        <Dummy />
      </Route>
      <Route path="/">
        <ManageNet />
      </Route>
    </Switch>
  </Router>
);

const Dummy = () => <div>Dummy</div>;

const Menu = styled.div`
  padding: 12px 24px;
  border-bottom: 1px solid grey;

  > * {
    margin-right: 12px;
  }
`;

const Logo = styled.span`
  font-size: 20px;
`;

export default App;
