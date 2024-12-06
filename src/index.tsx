import ReactDOM from 'react-dom';
import CodeModule from './components/code-module';
import 'bulmaswatch/darkly/bulmaswatch.min.css';

const App = () => {
    return (
        <div>
            <CodeModule/>
        </div>
    );
}

ReactDOM.render(
    <App/>, document.querySelector('#root')
)