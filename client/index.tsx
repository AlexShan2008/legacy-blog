import * as React from "react";
import * as ReactDOM from "react-dom";
import '../static/css/common.scss';

import { Hello } from "./components/header/Header";

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("root")
);