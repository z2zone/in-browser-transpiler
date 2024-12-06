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
        >
            {children}
        </ResizableBox>
    );
};

export default Resizable;