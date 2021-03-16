import "./styles.css";
import { Switch, Route } from "react-router-dom";
import { Home } from "./Home";
import { Auth } from "./Auth";
export default function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/auth" component={Auth} />
      </Switch>
    </>
  );
}
