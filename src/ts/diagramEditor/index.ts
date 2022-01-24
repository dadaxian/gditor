import {uploadFilesWithCover, uploadFilesWithNew} from "../upload/index";

class DiagramEditor {
    public editUrl: string;
    public initial: string;
    public name: string;
    public vditor: IVditor;

    constructor(vditor:IVditor) {
        this.vditor=vditor;
        this.initial = null;
        this.name = null;
    }

    public edit(elt: any) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.style.zIndex="1000000";

        var close = function () {
            window.removeEventListener('message', receive);
            document.body.removeChild(iframe);
        };
        var draftStr = localStorage.getItem('.draft-' + name);
        var draft: any;
        if (draftStr != null) {
            draft = JSON.parse(draftStr);

            if (!confirm("A version of this page from " + new Date(draft.lastModified) + " is available. Would you like to continue editing?")) {
                draft = null;
            }
        }

        var receive = function (evt: any) {
            if (evt.data.length > 0) {
                var msg = JSON.parse(evt.data);
                // If configure=1 URL parameter is used the application
                // waits for this message. For configuration options see
                // https://desk.draw.io/support/solutions/articles/16000058316
                if (msg.event == 'configure') {
                    // Configuration example
                    iframe.contentWindow.postMessage(JSON.stringify({
                        action: 'configure',
                        config: { defaultFonts: ["Humor Sans", "Helvetica", "Times New Roman"] }
                    }), '*');
                }
                else if (msg.event == 'init') {
                    if (draft != null) {
                        iframe.contentWindow.postMessage(JSON.stringify({
                            action: 'load',
                            autosave: 1, xml: draft.xml
                        }), '*');
                        iframe.contentWindow.postMessage(JSON.stringify({
                            action: 'status',
                            modified: true
                        }), '*');
                    }
                    else {
                        // Avoids unescaped < and > from innerHTML for valid XML
                        var svg = "";
                        // var svg = new XMLSerializer().serializeToString(elt.firstChild);
                        //  elt.getAttribute("src");
                        let xhr = new XMLHttpRequest();
                        let urlStr =elt.getAttribute("src");
                        var originUrl=new URL(urlStr);
                        let timestamp1 = (new Date()).valueOf();
                        xhr.open("GET", originUrl.origin+originUrl.pathname+"?ww="+timestamp1);
                        // xhr.setRequestHeader('X-Token', vditor.options.upload.token);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                svg = xhr.responseText;
                                console.log(xhr.responseText);

                                iframe.contentWindow.postMessage(JSON.stringify({
                                    action: 'load',
                                    autosave: 1, xml: svg
                                }), '*');
                            }
                        }
                        xhr.send();
                    }
                }
                else if (msg.event == 'export') {
                    // Extracts SVG DOM from data URI to enable links
                    var svg = atob(msg.data.substring(msg.data.indexOf(',') + 1));
                    // elt.innerHTML = svg;
                    var fileToUpload =[];
                    var blobParts=[];
                    blobParts.push(new Blob([svg]));
                    let urlStr =elt.getAttribute("src"); 
                    let hashIndex = urlStr.lastIndexOf("?");
                    if(hashIndex!=-1){
                        urlStr=urlStr.substring(0,urlStr.lastIndexOf("?"));
                    }
                    var filenanme=urlStr.substring(urlStr.lastIndexOf("/")+1);
                    fileToUpload.push(new File(blobParts,decodeURI(filenanme),{type:'image/svg+xml'}))
                    debugger
                    uploadFilesWithCover(this.window.vditor.vditor,fileToUpload,elt)
                    localStorage.setItem(this.name, JSON.stringify({ lastModified: new Date(), data: svg }));
                    localStorage.removeItem('.draft-' + name);
                    draft = null;
                    close();
                }
                else if (msg.event == 'autosave') {
                    localStorage.setItem('.draft-' + name, JSON.stringify({ lastModified: new Date(), xml: msg.xml }));
                }
                else if (msg.event == 'save') {
                    iframe.contentWindow.postMessage(JSON.stringify({
                        action: 'export',
                        format: 'xmlsvg', xml: msg.xml, spin: 'Updating page'
                    }), '*');
                    localStorage.setItem('.draft-' + name, JSON.stringify({ lastModified: new Date(), xml: msg.xml }));
                }
                else if (msg.event == 'exit') {
                    localStorage.removeItem('.draft-' + name);
                    draft = null;
                    close();
                }
            }
        };

        // window.addEventListener('hashchange', function () {
        //     uploadFiles(this.window.vditor, files)
        // });
        window.addEventListener('message', receive);
        iframe.setAttribute('src', this.vditor.options.upload.editUrl);
        document.body.appendChild(iframe);
    }

    public new() {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.style.zIndex="1000000";

        var close = function () {
            window.removeEventListener('message', receive);
            document.body.removeChild(iframe);
        };
        var draftStr = localStorage.getItem('.draft-' + name);
        var draft: any;
        if (draftStr != null) {
            draft = JSON.parse(draftStr);

            if (!confirm("A version of this page from " + new Date(draft.lastModified) + " is available. Would you like to continue editing?")) {
                draft = null;
            }
        }

        var receive = function (evt: any) {
            if (evt.data.length > 0) {
                var msg = JSON.parse(evt.data);
                // If configure=1 URL parameter is used the application
                // waits for this message. For configuration options see
                // https://desk.draw.io/support/solutions/articles/16000058316
                if (msg.event == 'configure') {
                    // Configuration example
                    iframe.contentWindow.postMessage(JSON.stringify({
                        action: 'configure',
                        config: { defaultFonts: ["Humor Sans", "Helvetica", "Times New Roman"] }
                    }), '*');
                }
                else if (msg.event == 'init') {
                    if (draft != null) {
                        iframe.contentWindow.postMessage(JSON.stringify({
                            action: 'load',
                            autosave: 1, xml: draft.xml
                        }), '*');
                        iframe.contentWindow.postMessage(JSON.stringify({
                            action: 'status',
                            modified: true
                        }), '*');
                    }
                    else {
                        // Avoids unescaped < and > from innerHTML for valid XML
                        var svg = "";
                        // var svg = new XMLSerializer().serializeToString(elt.firstChild);
                        //  elt.getAttribute("src");
                        iframe.contentWindow.postMessage(JSON.stringify({
                            action: 'load',
                            autosave: 1, xml: svg
                        }), '*');
                    }
                }
                else if (msg.event == 'export') {
                    // Extracts SVG DOM from data URI to enable links
                    var svg = atob(msg.data.substring(msg.data.indexOf(',') + 1));
                    // elt.innerHTML = svg;
                    var fileToUpload =[];
                    var blobParts=[];
                    blobParts.push(new Blob([svg]));
                    var filenanme="drawself.svg";
                    fileToUpload.push(new File(blobParts,decodeURI(filenanme),{type:'image/svg+xml'}))
                    uploadFilesWithNew(this.window.vditor.vditor,fileToUpload)
                    localStorage.setItem(this.name, JSON.stringify({ lastModified: new Date(), data: svg }));
                    localStorage.removeItem('.draft-' + name);
                    draft = null;
                    close();
                }
                else if (msg.event == 'autosave') {
                    localStorage.setItem('.draft-' + name, JSON.stringify({ lastModified: new Date(), xml: msg.xml }));
                }
                else if (msg.event == 'save') {
                    iframe.contentWindow.postMessage(JSON.stringify({
                        action: 'export',
                        format: 'xmlsvg', xml: msg.xml, spin: 'Updating page'
                    }), '*');
                    localStorage.setItem('.draft-' + name, JSON.stringify({ lastModified: new Date(), xml: msg.xml }));
                }
                else if (msg.event == 'exit') {
                    localStorage.removeItem('.draft-' + name);
                    draft = null;
                    close();
                }
            }
        };

        // window.addEventListener('hashchange', function () {
        //     uploadFiles(this.window.vditor, files)
        // });
        window.addEventListener('message', receive);
        iframe.setAttribute('src', this.vditor.options.upload.editUrl);
        document.body.appendChild(iframe);
    }

    public load() {
        this.initial = "";
        this.start();
    };

    public start() {
        this.name = (window.location.hash.length > 1) ? window.location.hash.substring(1) : 'default';
        // var current = localStorage.getItem(this.name);

        // if (current != null) {
        //     var entry = JSON.parse(current);
        //     document.getElementById('diagram').innerHTML = entry.data;
        // }
        // else {
        //     document.getElementById('diagram').innerHTML = this.initial;
        // }
    };
}


export { DiagramEditor };
