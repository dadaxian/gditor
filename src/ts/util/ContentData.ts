export class ContentData implements IContentData{

    title: string;
    createTime?: string;
    changeTileFun: Function;

    public constructor(){
        this.title="未命名标题";
        this.changeTileFun=function () {
            // console.log("yeyeye"+this.title);
            // 标题变化时触发
        }

    }
}