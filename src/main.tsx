import {render} from 'preact'
import './index.css'
import ViewController from "./screens/ViewController.tsx";

render(
    <ViewController/>
    , document.getElementById('app')!)
