import * as OSS from "ali-oss";
import * as aliOSS from "ali-oss";
import { getEditorRange, setSelectionFocus } from "../util/selection";
import { getElement } from "./getElement";
import { setHeaders } from "./setHeaders";


class DiagramEditor1 {
    public frame : HTMLIFrameElement;
    public title : string;
    public data :string;

     public element: HTMLElement;
    public isUploading: boolean;
    public range: Range;

    public previousCursor : string;
    public previousOverflow: string;

    public config: any;
    public drawDomain: string;
    public ui: string;
    public xml: any;
    public format: string;
    public libraries: boolean;
    public frameStyle: string;
    public urlParams: string[];
    public startElement: HTMLImageElement;
    public handleMessageEvent;

    constructor(config: any, ui: any, done: any, initialized: any, urlParams: any) {
        this.config = (config != null) ? config : this.config;
        this.ui = (ui != null) ? ui : this.ui;
        this.done = (done != null) ? done : this.done;
        this.initialized = (initialized != null) ? initialized : this.initialized;
        this.urlParams = urlParams;


        this.handleMessageEvent = function (evt:any) {
            if (this.frame != null && evt.source == this.frame.contentWindow &&
                evt.data.length > 0) {
                try {
                    var msg = JSON.parse(evt.data);

                    if (msg != null) {
                        this.handleMessage(msg);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
        };
    }

    /**
     * Static method to edit the diagram in the given img or object.
     */
    public editElement1(elt :any, config :any, ui :any, done :any, urlParams :any) {
        debugger
        if (!elt.diagramEditorStarting) {
            elt.diagramEditorStarting = true;

            return new DiagramEditor(config, ui, done, function () {
                delete elt.diagramEditorStarting;
            }, urlParams).editElement(elt);
        }
    };
    /**
     * Adds the iframe and starts editing.
     */
    public editElement(elem: any) {
        var src = this.getElementData(elem);
        this.startElement = elem;
        var fmt = this.format;

        if (src.substring(0, 15) === 'data:image/png;') {
            fmt = 'xmlpng';
        }
        else if (src.substring(0, 19) === 'data:image/svg+xml;' ||
            elem.nodeName.toLowerCase() == 'svg') {
            fmt = 'xmlsvg';
        }

        this.startEditing(src, fmt);

        return this;
    };

    /**
     * Adds the iframe and starts editing.
     */
    public getElementData(elem: any) {
        var name = elem.nodeName.toLowerCase();

        return elem.getAttribute((name == 'svg') ? 'content' :
            ((name == 'img') ? 'src' : 'data'));
    };

    /**
     * Adds the iframe and starts editing.
     */
    public setElementData(elem: any, data: any) {
        var name = elem.nodeName.toLowerCase();

        if (name == 'svg') {
            elem.outerHTML = atob(data.substring(data.indexOf(',') + 1));
        }
        else {
            elem.setAttribute((name == 'img') ? 'src' : 'data', data);
        }

        return elem;
    };

    /**
     * Starts the editor for the given data.
     */
    public startEditing(data: string, format: string, title?: string) {
        if (this.frame == null) {
            window.addEventListener('message', this.handleMessageEvent);
            this.format = (format != null) ? format : this.format;
            this.title = (title != null) ? title : this.title;
            this.data = data;

            this.frame = this.createFrame(
                this.getFrameUrl(),
                this.getFrameStyle());
            document.body.appendChild(this.frame);
            this.setWaiting(true);
        }
    };

    /**
     * Updates the waiting cursor.
     */
    public setWaiting(waiting: any) {
        if (this.startElement != null) {
            // Redirect cursor to parent for SVG and object
            var elt = this.startElement;
            var name = elt.nodeName.toLowerCase();

            if (name == 'svg' || name == 'object') {
                elt = elt.par.parentNode;
            }

            if (elt != null) {
                if (waiting) {
                    this.frame.style.pointerEvents = 'none';
                    this.previousCursor = elt.style.cursor;
                    elt.style.cursor = 'wait';
                }
                else {
                    elt.style.cursor = this.previousCursor;
                    this.frame.style.pointerEvents = '';
                }
            }
        }
    };

    /**
     * Updates the waiting cursor.
     */
    public setActive(active: any) {
        if (active) {
            this.previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = this.previousOverflow;
        }
    };

    /**
     * Removes the iframe.
     */
    public stopEditing() {
        if (this.frame != null) {
            window.removeEventListener('message', this.handleMessageEvent);
            document.body.removeChild(this.frame);
            this.setActive(false);
            this.frame = null;
        }
    };

    /**
     * Send the given message to the iframe.
     */
    public postMessage(msg: any) {
        if (this.frame != null) {
            this.frame.contentWindow.postMessage(JSON.stringify(msg), '*');
        }
    };

    /**
     * Returns the diagram data.
     */
    public getData() {
        return this.data;
    };

    /**
     * Returns the title for the editor.
     */
    public getTitle() {
        return this.title;
    };

    /**
     * Returns the CSS style for the iframe.
     */
    public getFrameStyle() {
        return this.frameStyle + ';left:' +
            document.body.scrollLeft + 'px;top:' +
            document.body.scrollTop + 'px;';
    };

    /**
     * Returns the URL for the iframe.
     */
    public getFrameUrl() {
        var url = this.drawDomain + '?proto=json&spin=1';

        if (this.ui != null) {
            url += '&ui=' + this.ui;
        }

        if (this.libraries != null) {
            url += '&libraries=1';
        }

        if (this.config != null) {
            url += '&configure=1';
        }

        if (this.urlParams != null) {
            url += '&' + this.urlParams.join('&');
        }

        return url;
    };

    /**
     * Creates the iframe.
     */
    public createFrame(url: any, style: any) {
        var frame = document.createElement('iframe');
        frame.setAttribute('frameborder', '0');
        frame.setAttribute('style', style);
        frame.setAttribute('src', url);

        return frame;
    };

    /**
     * Sets the status of the editor.
     */
    public setStatus(messageKey: any, modified: any) {
        this.postMessage({ action: 'status', messageKey: messageKey, modified: modified });
    };

    /**
     * Handles the given message.
     */
    public handleMessage(msg : any) {
        if (msg.event == 'configure') {
            this.configureEditor();
        }
        else if (msg.event == 'init') {
            this.initializeEditor();
        }
        else if (msg.event == 'autosave') {
            this.save(msg.xml, true, this.startElement);
        }
        else if (msg.event == 'export') {
            this.setElementData(this.startElement, msg.data);
            this.stopEditing();
            this.xml = null;
        }
        else if (msg.event == 'save') {
            this.save(msg.xml, false, this.startElement);
            this.xml = msg.xml;

            if (msg.exit) {
                msg.event = 'exit';
            }
            else {
                this.setStatus('allChangesSaved', false);
            }
        }

        if (msg.event == 'exit') {
            if (this.format != 'xml') {
                if (this.xml != null) {
                    this.postMessage({
                        action: 'export', format: this.format,
                        xml: this.xml, spinKey: 'export'
                    });
                }
                else {
                    this.stopEditing();
                }
            }
            else {
                if (msg.modified == null || msg.modified) {
                    this.save(msg.xml, false, this.startElement);
                }

                this.stopEditing();
            }
        }
    };

    /**
     * Posts configure message to editor.
     */
    public configureEditor() {
        this.postMessage({ action: 'configure', config: this.config });
    };

    /**
     * Posts load message to editor.
     */
    public initializeEditor() {
        this.postMessage({
            action: 'load', autosave: 1, saveAndExit: '1',
            modified: 'unsavedChanges', xml: this.getData(),
            title: this.getTitle()
        });
        this.setWaiting(false);
        this.setActive(true);
        this.initialized();
    };

    /**
     * Saves the given data.
     */
    public save(data: any, draft: any, elt: any) {
        this.done();
        // this.done(data, draft, elt);
    };

    /**
     * Invoked after save.
     */
    public done() {
        // hook for subclassers
    };

    /**
     * Invoked after the editor has sent the init message.
     */
    public initialized() {
        // hook for subclassers
    };

}


export { DiagramEditor1 };
