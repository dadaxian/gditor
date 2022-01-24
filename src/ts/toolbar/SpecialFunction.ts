import { DiagramEditor } from "../diagramEditor/index";
import { getEventName, updateHotkeyTip } from "../util/compatibility";
import { MenuItem } from "./MenuItem";
import { hidePanel, toggleSubMenu } from "./setToolbar";


export class SprcialFuntion extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        const panelElement = document.createElement("div");
        debugger
        panelElement.className = `vditor-hint${menuItem.level === 2 ? "" : " vditor-panel--arrow"}`;
        panelElement.innerHTML = `<button data-mode="wysiwyg">画板&lt;${updateHotkeyTip("⌥⌘7")}></button>`;

        this.element.appendChild(panelElement);

        this._bindEvent(vditor, panelElement, menuItem);
    }

    public _bindEvent(vditor: IVditor, panelElement: HTMLElement, menuItem: IMenuItem) {
        const actionBtn = this.element.children[0] as HTMLElement;
        toggleSubMenu(vditor, panelElement, actionBtn, menuItem.level);

        panelElement.children.item(0).addEventListener(getEventName(), (event: Event) => {
            var editor = new DiagramEditor(vditor);
            editor.load();
            editor.new();
            hidePanel(vditor, ["subToolbar"]);
            event.preventDefault();
            event.stopPropagation();
        });
    }
}
