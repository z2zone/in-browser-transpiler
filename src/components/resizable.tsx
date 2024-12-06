import { ResizableBox } from "react-resizable";
import './resizable.css';

type Props = {
    direction: string,
    children: any
};

const Resizable: React.FC<Props> = ({direction, children}) => {
    return (
        <ResizableBox 
            height={300} 
            width={Infinity}
            resizeHandles={['s']}
            maxConstraints={[Infinity, window.innerHeight * 0.9]}
            minConstraints={[Infinity, 100]}
        >
            {children}
        </ResizableBox>
    );
};

export default Resizable;