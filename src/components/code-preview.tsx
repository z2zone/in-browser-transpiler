import React from 'react';
import { useRef, useEffect } from 'react';
import './code-preview.css';

type Props = {
    code: string;
};

const iframeHtml = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
        <div id="root"></div>
        <script>
            window.addEventListener('message', (event) => {
                try{
                    eval(event.data);
                }catch(err){
                    const root = document.querySelector('#root');
                    root.innerHTML = '<div style="color:red;">' + err + '</div>';
                    throw err;
                };
            });
        </script>
    </body>
</html>
`;

const CodePreview: React.FC<Props> = ({code}) => {
    const refIframe = useRef<any>();
    useEffect(() => {
        // refresh iframe with basic template
        // refIframe.current.srcdoc = iframeHtml;
        
        //passing data to the iframe using postMessage
        refIframe.current.contentWindow.postMessage(code, "*");
    }, [code]);

    return (
        <iframe
            className="code-preview-iframe"
            title="code-bundle" 
            ref={refIframe} 
            sandbox="allow-scripts" 
            srcDoc={iframeHtml}
        />
    );
}

export default CodePreview;